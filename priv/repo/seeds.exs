# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Parenthese.Repo.insert!(%Parenthese.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
Parenthese.Repo.insert!(%Parenthese.Projects.Project{
  date: ~D[2010-04-17],
  description: "un super projet",
  flickr_id: "1234",
  location: "1234,5678",
  status: "done",
  title: "project 0",
  vimeo_ids: ["1", "2"],
  youtube_ids: []
})
