# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :parenthese,
  ecto_repos: [Parenthese.Repo]

# Configures the endpoint
config :parenthese, ParentheseWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "h+mMRx43FLpyE8mwPKZ/uLsh7OAkKRMXMlfajQLxn4aR6OsCJUdKicUFdpgEZozg",
  render_errors: [view: ParentheseWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Parenthese.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :gettext, :default_locale, "fr"

config :ex_aws,
  json_codec: Jason,
  region: "eu-west-1"

config :parenthese,
  admin_auth: [
    username: {:system, "BASIC_AUTH_USERNAME"},
    password: {:system, "BASIC_AUTH_PASSWORD"}
  ]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
