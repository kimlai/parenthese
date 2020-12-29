defmodule Parenthese.Repo.Migrations.AddProjectPublished do
  use Ecto.Migration

  def change do
    alter table("projects") do
      add(:published, :boolean, default: false)
    end
  end
end
