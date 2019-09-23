defmodule Parenthese.Repo.Migrations.CreatePublications do
  use Ecto.Migration

  def change do
    create table(:publications) do
      add :title, :string
      add :project, :string
      add :journal, :string
      add :url, :string
      add :date, :string

      timestamps()
    end

  end
end
