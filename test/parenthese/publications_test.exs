defmodule Parenthese.PublicationsTest do
  use Parenthese.DataCase

  alias Parenthese.Publications

  describe "publications" do
    alias Parenthese.Publications.Publication

    @valid_attrs %{date: "some date", journal: "some journal", project: "some project", title: "some title", url: "some url"}
    @update_attrs %{date: "some updated date", journal: "some updated journal", project: "some updated project", title: "some updated title", url: "some updated url"}
    @invalid_attrs %{date: nil, journal: nil, project: nil, title: nil, url: nil}

    def publication_fixture(attrs \\ %{}) do
      {:ok, publication} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Publications.create_publication()

      publication
    end

    test "list_publications/0 returns all publications" do
      publication = publication_fixture()
      assert Publications.list_publications() == [publication]
    end

    test "get_publication!/1 returns the publication with given id" do
      publication = publication_fixture()
      assert Publications.get_publication!(publication.id) == publication
    end

    test "create_publication/1 with valid data creates a publication" do
      assert {:ok, %Publication{} = publication} = Publications.create_publication(@valid_attrs)
      assert publication.date == "some date"
      assert publication.journal == "some journal"
      assert publication.project == "some project"
      assert publication.title == "some title"
      assert publication.url == "some url"
    end

    test "create_publication/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Publications.create_publication(@invalid_attrs)
    end

    test "update_publication/2 with valid data updates the publication" do
      publication = publication_fixture()
      assert {:ok, %Publication{} = publication} = Publications.update_publication(publication, @update_attrs)
      assert publication.date == "some updated date"
      assert publication.journal == "some updated journal"
      assert publication.project == "some updated project"
      assert publication.title == "some updated title"
      assert publication.url == "some updated url"
    end

    test "update_publication/2 with invalid data returns error changeset" do
      publication = publication_fixture()
      assert {:error, %Ecto.Changeset{}} = Publications.update_publication(publication, @invalid_attrs)
      assert publication == Publications.get_publication!(publication.id)
    end

    test "delete_publication/1 deletes the publication" do
      publication = publication_fixture()
      assert {:ok, %Publication{}} = Publications.delete_publication(publication)
      assert_raise Ecto.NoResultsError, fn -> Publications.get_publication!(publication.id) end
    end

    test "change_publication/1 returns a publication changeset" do
      publication = publication_fixture()
      assert %Ecto.Changeset{} = Publications.change_publication(publication)
    end
  end
end
