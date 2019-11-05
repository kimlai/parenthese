defmodule Parenthese.Repo.Migrations.AddVeryShortDesc do
  use Ecto.Migration
  import Ecto.Query

  def up do
    alter table("projects") do
      add(:very_short_description, :string)
    end

    flush()

    from(p in "projects",
      update: [set: [very_short_description: p.short_description]]
    )
    |> Parenthese.Repo.update_all([])
  end

  def down do
    alter table(:projects) do
      remove(:very_short_description)
    end
  end
end
