# Workflow

## 1. waktu dan berat pakan

``` 
data = {
    "waktu": "2024-05-18T15:30:00Z",
    "berat": 10 //optional 
}
```
- logic
pada database akan ada beberapa data, lakukan sorting berdasarkan waktu.
lalu lakukan pengecekan waktu, jika waktu sekarang sama dengan waktu yang dijadwalkan maka berikan pakan dengan berat yang dijadwalkan.
jika pakan telah diberikan maka hapus data tersebut dari database.

```psuedocode
data = get_data()
sorted_data = sort_data(data)
for i in sorted_data:
    if i.waktu == now:
        berikan_pakan(i.berat)
        kirim_data_history(i)
        delete_data(i)
```
