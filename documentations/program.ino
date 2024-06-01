#include <WiFi.h>
#include <Arduino.h>
#include <Servo.h>
#include <HX711.h>
#include <AccelStepper.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

/*
  * definisi server NTP, offset waktu UTC (25200 untuk Waktu Indonesia Barat)
  * nama jaringan WiFi, dan sandi jaringan WiFi.
*/

#define NTP_SERVER "pool.ntp.org" 
#define UTC_OFFSET 25200 
#define UTC_OFFSET_DST 0

const char *ssid = "Nama_WiFi"; 
const char *password = "Password_WiFi"; 

const char *schedule_api_url = "https://pakan-ikan-otomatis.vercel.app/api/schedule/waitinglist"; 

/*
  * deklarasi variabel global dan pin yang digunakan.
*/

const int dataPin = 3;
const int clockPin = 2;

int actualLoadcellValue = 0;
long loadcellValue = 0;
String status;

/*
deklarasi objek-objek yang digunakan.
*/
AccelStepper stepper(1, 14, 27);
Servo servo1;
HX711 scale;

// data structure untuk jadwal pemberian pakan
struct Schedule {
  String status;
  String datetime;
  int weight;
  int id;
};

/*
  deklarasi fungsi-fungsi yang digunakan.
  hal ini dilakukan karena pada cpp, custom function harus berada diatas fungsi setup() .
  * getSchedule() untuk mendapatkan jadwal pemberian pakan dari API.
  * getTime() untuk mendapatkan waktu saat ini.
  * postHistory() untuk mengirim data ke API history.
  * deleteSchedule() untuk menghapus jadwal pemberian pakan dari API.
*/

Schedule getSchedule();
String getTime();
void changeScheduleStatus(int id, String status, String datetime, int weight);

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.print("Menghubungkan ke : ");
  Serial.print(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Koneksi WiFi berhasil");
  Serial.println("Alamat IP: ");
  Serial.println(WiFi.localIP());

  configTime(UTC_OFFSET, UTC_OFFSET_DST, NTP_SERVER); // Mengatur waktu menggunakan NTP

  /* 
  initialisasi motor servo, motor stepper, dan sensor loadcell.
    * Menghubungkan motor servo ke pin 9.
    * Mengatur kecepatan dan percepatan motor stepper.
    * Mengatur skala sensor loadcell dan melakukan kalibrasi.
  */
  servo1.attach(9);
  stepper.setMaxSpeed(1000);
  stepper.setAcceleration(500);
  scale.begin(dataPin, clockPin);
  scale.set_scale(127.15);
  scale.tare();
}

void loop() {

 // Mendapatkan waktu saat ini
  const char* time = getTime().c_str();

  //error handle jika waktu tidak didapatkan
  if(time != NULL)
  { 
    // Mendapatkan jadwal pemberian pakan
    Schedule schedule = getSchedule();
    Serial.println("Waktu saat ini: " + String(time));

     //error handle jika jadwal tidak didapatkan atau jadwal tidak ada
      if (schedule != NULL)
      {
        Serial.println("Jadwal pemberian pakan: " + String(schedule.datetime));

     // Membandingkan waktu saat ini dengan jadwal pemberian pakan
        if (time == schedule.datetime)
        {
          // Langkah 1: Mulai
          Serial.println("Algoritma dimulai...");
          // Langkah 3: Gerakkan motor servo 1 sebesar 90 derajat
          Serial.println("Menggerakkan motor servo 1 sebesar 90 derajat...");
          servo1.write(90);
          delay(1000);

          // Langkah 4: Baca nilai dari sensor loadcell dan tunggu sampai mendekati atau sama dengan input
          Serial.println("Mengukur nilai sensor loadcell...");
          loadcellValue = scale.get_units();
          while (abs(loadcellValue - schedule.weight) > 5) {
            loadcellValue = scale.get_units();
            Serial.print("Nilai sensor loadcell: ");
            Serial.println(loadcellValue);
            delay(500);
          }
          Serial.println("Nilai sensor loadcell mendekati atau sama dengan input yang dimasukkan.");

         // Simpan nilai aktual dari sensor loadcell
         // Nilai ini akan digunakan untuk mengirim data ke API history
          actualLoadcellValue = loadcellValue;

         // Kembalikan posisi motor servo ke posisi awal
          Serial.println("Memulihkan posisi motor servo ke posisi awal...");
          servo1.write(0);
         // Menunggu motor servo mencapai posisi awal
          delay(5000);

         // Langkah 5: Gerakkan motor stepper hingga nilai pada loadcell mencapai 0
          Serial.println("Motor stepper bergerak hingga nilai pada load cell mencapai 0...");
          stepper.setSpeed(100); // Set kecepatan motor stepper
          stepper.moveTo(200); // Gerakkan motor stepper sejauh 200 langkah (180 derajat)
          while (abs(loadcellValue) > 0) {
            stepper.run();
            loadcellValue = scale.get_units();
            Serial.print("Nilai sensor loadcell: ");
            Serial.println(loadcellValue);
            delay(100);
          }
          stepper.stop(); // Berhenti saat nilai pada loadcell mencapai 0

          status = "done";

          changeScheduleStatus(schedule.id, status , schedule.datetime, actualLoadcellValue); // Ubah status jadwal pemberian pakan menjadi selesai
        }
      }
      Serial.println("Tidak ada jadwal pemberian pakan untuk saat ini");
  }
  else
  {
    Serial.println("Gagal mendapatkan waktu");
  }
  delay(1000); // Tambahkan penundaan untuk mengurangi beban CPU
}

/*
  * Fungsi getTime() untuk mendapatkan waktu saat ini.
  esp32 memiliki internal RTC yang dapat digunakan untuk 
  mendapatkan waktu saat ini.
  fungsi ini akan mengembalikan waktu dalam format string.
*/

String getTime(){
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return "Failed to obtain time";
  } else {
    char timeStringBuff[25];
    strftime(timeStringBuff, sizeof(timeStringBuff), "%Y-%m-%dT%H:%S.000Z", &timeinfo);
    return String(timeStringBuff);
  }
}

/*
  * Fungsi getSchedule() untuk mendapatkan jadwal pemberian pakan dari API.
  fungsi ini akan mengembalikan data jadwal pemberian pakan dalam bentuk struct Schedule.
*/

Schedule getSchedule(){
  Schedule getSchedule;
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(schedule_api_url);
    int httpResponseCode = http.GET();
    if(httpResponseCode > 0) {
      if(httpResponseCode == HTTP_CODE_OK) {
        // Parse JSON
        String payload = http.getString();
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, payload);
        if(doc.size() > 0){
          Serial.println("Didapatkan beberapa data");

          getSchedule.status = doc[0]["status"].as<String>();
          getSchedule.datetime = doc[0]["datetime"].as<String>();
          getSchedule.weight = doc[0]["weight"].as<int>();
          getSchedule.id = doc[0]["id"].as<int>();
          return getSchedule;
        }
      }
    } else {
      Serial.println("HTTP Response Code: " + String(httpResponseCode));
      Serial.println("Error on HTTP request");
    }
    http.end();
  } else {
    Serial.println("Error in WiFi connection");
  }
}

/*
  * Fungsi postHistory() untuk mengirim data ke API history.
  fungsi ini akan mengirimkan data berupa waktu, status, dan berat pakan yang diberikan.
  @param : id, waktu, status, berat aktual
*/

void changeScheduleStatus(int id, String status, String datetime, int weight){
  if(WiFi.status() == WL_CONNECTED) {

    DynamicJsonDocument doc(1024);
    doc["datetime"] = datetime;
    doc["status"] = status;
    doc["weight"] = weight;

    String payload;
    serializeJson(doc, payload);

    HTTPClient http;

    String url = String(schedule_api_url) + "/" + id;

    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.PUT(payload);
    if(httpResponseCode > 0) {
      if(httpResponseCode == HTTP_CODE_OK) {
        Serial.println("Status jadwal berhasil diubah");
      }
    } else {
      Serial.println("HTTP Response Code: " + String(httpResponseCode));
      Serial.println("Error on HTTP request");
    }
    http.end();
  } else {
    Serial.println("Error in WiFi connection");
  }
}
