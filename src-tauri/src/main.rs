// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod models;
mod schema;
mod utils;

use diesel::prelude::*;
use diesel::SqliteConnection;
use models::Student;

use self::models::NewStudent;
use utils::{create_data_dir_if_not_exist, get_db_url, run_migrations};

// pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");

// fn run_migrations(connection: &mut SqliteConnection) -> Result<(), Box<dyn Error>> {
//     let _ = connection.run_pending_migrations(MIGRATIONS);

//     Ok(())
// }

fn main() {
    let _ = create_data_dir_if_not_exist();
    let db_url = get_db_url();
    let mut connection =
        SqliteConnection::establish(&db_url).expect("Failed to connect to database");

    run_migrations(&mut connection).expect("Error running migrations");

    println!("{}", db_url);

    let students = get_all_students(&mut connection);
    for student in students {
        println!("Student: {}", student.name);
    }

    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn get_all_students(conn: &mut SqliteConnection) -> Vec<Student> {
    use crate::schema::students::dsl::*;
    students
        .load::<Student>(conn)
        .expect("Error loading students")
}

fn _create_student(conn: &mut SqliteConnection, name: &str, age: i32) {
    use crate::schema::students;
    let new_student = NewStudent { name, age };

    diesel::insert_into(students::table)
        .values(&new_student)
        .execute(conn)
        .expect("Error Making a new post");
}
