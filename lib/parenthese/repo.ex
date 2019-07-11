defmodule Parenthese.Repo do
  use Ecto.Repo,
    otp_app: :parenthese,
    adapter: Ecto.Adapters.Postgres
end
