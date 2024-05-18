# Workflow

## 1. waktu dan berat pakan

``` 
data = {
    "waktu": "2024-05-18T15:30:00Z",
    "berat": 10 //optional 
}
```
- Logic

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

