import Config

# Configure your database
config :parenthese, Parenthese.Repo,
  username: "postgres",
  password: "postgres",
  database: "parenthese_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :parenthese, ParentheseWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

config :parenthese,
  admin_auth: [
    username: "admin",
    password: "admin"
  ]
