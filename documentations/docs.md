# Documentations

## 1. penjadwalan pakan 

### Table

| column name | data type | description |
|-------------|-----------|-------------|
| id          | int       | id jadwal, primary key, auto increment |
| waktu       | datetime  | waktu pemberian pakan |
| berat       | int       | berat pakan yang akan diberikan |
| status      | string       | status pemberian pakan |


### 1.1. API

#### 1.1.1. get jadwal

- Endpoint : GET /schedule/waitinglist
- description : mendapatkan list jadwal pemberian pakan
- Request : GET 
- response :
    - Status: 200 OK - return list dari jadwal pemberian pakan dengan detail waktu dan berat pakan
    - Status: 404 Bad Request - jika data tidak ditemukan 

#### 1.1.2. update jadwal

- Endpoint : PUT /schedule/waitinglist/:id
- description : mengupdate status jadwal pemberian pakan
- Request : 

```
PUT /jadwal/:id
Content-Type: application/json

{
    "waktu": "2024-05-18T15:30:00Z",
    "berat": 10
    "status" : "done" | "waiting"
}
```
- response :
    - Status: 200 OK - return list dari jadwal pemberian pakan dengan detail waktu dan berat pakan
    - Status: 400 Bad Request - jika request tidak sesuai/invalid
    - Status: 404 Not Found - jika data tidak ditemukan

### Business Logic

pada database akan ada beberapa data, lakukan sorting berdasarkan waktu.
lalu lakukan pengecekan waktu, jika waktu sekarang sama dengan waktu yang dijadwalkan maka berikan pakan dengan berat yang dijadwalkan.
jika pakan telah diberikan maka hapus data tersebut dari database.

```psuedocode
data = get_data() // get data from database
if !data:
    return   // if data is empty return 
sorted_data = sort_data(data) // sort data by waktu
for i in sorted_data:  // loop through sorted data
    if i.waktu == now:  // check if waktu is now
        berikan_pakan(i.berat) // berikan pakan
        ubah_status(i.id, "done" | "error") // ubah status jadwal
```

## 2. ESP32 

ESP32 adalah mikrokontroler yang digunakan pada sistem pakan ikan otomatis. ESP32 digunakan untuk mengontrol hardware yang digunakan pada sistem pakan ikan otomatis. ESP32 juga digunakan untuk menghubungkan sistem pakan ikan otomatis dengan internet.
Dapatkan implementasi program untuk ESP32 [disini](program.ino).


### 2.1. Hardware

Berikut adalah hardware yang digunakan pada sistem pakan ikan otomatis

- ESP32
- Servo Motor
- Load Cell(HX711)
- Stepper Motor

### 2.2. library

Berikut adalah library yang dibutuhkan untuk mengontrol hardware pada ESP32

```cpp
#include <WiFi.h>
#include <Arduino.h>
#include <Servo.h>
#include <HX711.h>
#include <AccelStepper.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

```

