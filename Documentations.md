# Workflow

## 1. penjadwalan pakan 

### Table

| column name | data type | description |
|-------------|-----------|-------------|
| id          | int       | id jadwal, primary key, auto increment |
| waktu       | datetime  | waktu pemberian pakan |
| berat       | int       | berat pakan yang akan diberikan |


### 1.1. API

#### 1.1.1. create jadwal

- Endpoint : POST /jadwal
- description : menambahkan jadwal pemberian pakan
- Request : 

```
POST /jadwal
Content-Type: application/json

{
    "waktu": "2024-05-18T15:30:00Z",
    "berat": 10
}
```
- response :
    - Status: 200 OK - return list dari jadwal pemberian pakan dengan detail waktu dan berat pakan
    - Status: 400 Bad Request - jika request tidak sesuai/invalid


#### 1.1.2. get jadwal

- Endpoint : GET /jadwal
- description : mendapatkan list jadwal pemberian pakan
- Request : GET 
- response :
    - Status: 200 OK - return list dari jadwal pemberian pakan dengan detail waktu dan berat pakan
    - Status: 404 Bad Request - jika data tidak ditemukan 

#### 1.1.3. update jadwal

- Endpoint : PUT /jadwal/:id
- description : mengupdate jadwal pemberian pakan
- Request : 

```
PUT /jadwal/:id
Content-Type: application/json

{
    "waktu": "2024-05-18T15:30:00Z",
    "berat": 10
}
```
- response :
    - Status: 200 OK - return list dari jadwal pemberian pakan dengan detail waktu dan berat pakan
    - Status: 400 Bad Request - jika request tidak sesuai/invalid
    - Status: 404 Not Found - jika data tidak ditemukan

#### 1.1.4. delete jadwal

- Endpoint : DELETE /jadwal/:id
- description : menghapus jadwal pemberian pakan
- Request : DELETE
- response :
    - Status: 200 OK - return list dari jadwal pemberian pakan dengan detail waktu dan berat pakan
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
        kirim_data_history(i) // kirim data history
        delete_data(i) // delete data
```
## 2. history pakan

### Table

| column name | data type | description |
|-------------|-----------|-------------|
| id          | int       | id history, primary key, auto increment |
| waktu       | datetime  | waktu pemberian pakan |
| berat       | int       | berat pakan yang diberikan |

### 2.1. API

#### 2.1.1. get history

- Endpoint : GET /history
- description : mendapatkan list history pemberian pakan
- Request : GET
- response :
    - Status: 200 OK - return list dari history pemberian pakan dengan detail waktu dan berat pakan
    - Status: 404 Not Found - jika data tidak ditemukan

#### 2.1.2. create history

- Endpoint : POST /history
- description : menambahkan history pemberian pakan
- Request : 

```
POST /history
Content-Type: application/json

{
    "waktu": "2024-05-18T15:30:00Z",
    "berat": 10
}
```
- response :
    - Status: 200 OK - return list dari history pemberian pakan dengan detail waktu dan berat pakan
    - Status: 400 Bad Request - jika request tidak sesuai/invalid

### Business Logic

setelah pakan diberikan, data history akan di simpan ke database.

```psuedocode
data = get_data() // get data from database
if !data:
    return   // if data is empty return
sorted_data = sort_data(data) // sort data by waktu
for i in sorted_data:  // loop through sorted data
    if i.waktu == now:  // check if waktu is now
        berikan_pakan(i.berat) // berikan pakan
   -->  kirim_data_history(i) // kirim data history
        delete_data(i) // delete data
```



