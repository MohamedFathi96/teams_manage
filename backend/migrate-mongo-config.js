const config = {
  mongodb: {
    url: "mongodb://127.0.0.1:27017/chatty",
    databaseName: "chatty",
    options: {
      // MongoDB driver options can be added here if needed
    }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: 'esm',
};

export default config;
