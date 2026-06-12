import AppDatabase from "./database";
let db = new AppDatabase();
export function addPatient(data){

    console.log("Data received in lib.jsx:", data);
    return {success: true, message: "Patient added successfully"};
}