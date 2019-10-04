defmodule Parenthese.Repo.Migrations.AddBudgetToProjects do
  use Ecto.Migration

  def change do
    alter table("projects") do
      add(:budget, :string)
    end
  end
end
