use dirs::data_dir;
use std::fs;
use std::path::PathBuf;

use diesel::SqliteConnection;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use std::error::Error;

const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");

pub fn run_migrations(connection: &mut SqliteConnection) -> Result<(), Box<dyn Error>> {
    let _ = connection.run_pending_migrations(MIGRATIONS);

    Ok(())
}

pub fn create_data_dir_if_not_exist() -> std::io::Result<()> {
    let app_data_directory = data_dir().expect("Failed to get data directory");
    let company_directory = app_data_directory.join("RadhikaSoftwares");
    let chiselstone_directory = company_directory.join("ChiselStoneApp");
    let data_directory = chiselstone_directory.join("app_data");

    create_directory(&company_directory)?;
    create_directory(&chiselstone_directory)?;
    create_directory(&data_directory)?;

    let sqlite_file = data_directory.join("data.sqlite");

    if !sqlite_file.exists() {
        fs::File::create(&sqlite_file)?;
    }

    println!("File Done");
    Ok(())
}

fn create_directory(directory: &PathBuf) -> std::io::Result<()> {
    if !directory.exists() {
        fs::create_dir(directory)?;
    }

    Ok(())
}

pub fn get_db_url() -> String {
    let sqlite_file_path = get_sqlite_file_path();
    format!("sqlite://{}", sqlite_file_path)
}

fn get_sqlite_file_path() -> String {
    let data_dir = data_dir().expect("Failed to get data directory");
    let app_data_dir = data_dir.join("RadhikaSoftwares/ChiselStoneApp/app_data");
    let sqlite_file = app_data_dir.join("data.sqlite");
    sqlite_file.to_string_lossy().into_owned()
}
