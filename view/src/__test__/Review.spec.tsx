import React from "react";
import { act, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Comment, CommentSection } from "../pages/DetailPage";
import { renderWithProviders } from "../utils/test-utils";

describe("Comment", () => {
  it("should render a comment", () => {
    const props = {
      index: 1,
      profile_src: "https://via.placeholder.com/150",
      username: "username",
      date: "2021-08-01",
      rating: 5,
      comment: "comment",
    };

    const { getByText, getByTestId } = renderWithProviders(
      <Comment {...props} />
    );

    expect(getByText(props.username)).toBeInTheDocument();
    expect(getByText(props.date)).toBeInTheDocument();
    expect(getByText(props.comment)).toBeInTheDocument();
    const image = document.querySelector(`img[src="${props.profile_src}"]`);
    expect(image).toBeInTheDocument();
    expect(
      getByTestId("ratingInComment" + props.username + props.date)
    ).toBeInTheDocument();
  });
});

describe("CommentSection", () => {
  const data_comments = [
    {
      id: 1,
      movie_id: 2,
      user_id: 1,
      rate: 3,
      comments: "comment 1",
      comment_date: "2022-11-10T17:00:00.000Z",
      status: "accepted",
      created_at: "2024-11-17T08:21:05.000Z",
      updated_at: "2024-11-17T08:21:05.000Z",
      deleted_at: null,
      username: "The Movie Mob",
      profile_picture:
        "https://image.tmdb.org/t/p/w92/https://image.tmdb.org/t/p/w92/blEC280vq31MVaDcsWBXuGOsYnB.jpg",
    },
    {
      id: 2,
      movie_id: 2,
      user_id: 2,
      rate: 3,
      comments: "comment2",
      comment_date: "2022-11-10T17:00:00.000Z",
      status: "accepted",
      created_at: "2024-11-17T08:21:05.000Z",
      updated_at: "2024-11-17T08:21:05.000Z",
      deleted_at: null,
      username: "Manuel São Bento",
      profile_picture: "",
    },
    {
      id: 3,
      movie_id: 2,
      user_id: 3,
      rate: 3,
      comments: "comment3",
      comment_date: "2022-11-13T17:00:00.000Z",
      status: "accepted",
      created_at: "2024-11-17T08:21:05.000Z",
      updated_at: "2024-11-17T08:21:05.000Z",
      deleted_at: null,
      username: "CinemaSerf",
      profile_picture:
        "https://image.tmdb.org/t/p/w92/https://image.tmdb.org/t/p/w92/yz2HPme8NPLne0mM8tBnZ5ZWJzf.jpg",
    },
  ];
  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ comments: data_comments, total: 3 }),
        headers: new Headers(),
        redirected: false,
        statusText: "OK",
        type: "basic",
        url: "",
      });
    });
  });
  it("should load comments from fetch", async () => {
    const { getByText, getAllByText } = renderWithProviders(<CommentSection />);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    await act(async () => {
      expect(getByText("Loading comments...")).toBeInTheDocument();
      await new Promise((r) => setTimeout(r, 4000));
    });

    expect(
      getByText("(" + data_comments.length + ") People think about this drama")
    ).toBeInTheDocument();
    data_comments.forEach((comment) => {
      expect(getByText(comment.username)).toBeInTheDocument();
      const date = new Date(comment.comment_date).toLocaleDateString("id-ID");
      expect(getAllByText(date).length).toBeGreaterThanOrEqual(1);
      expect(getByText(comment.comments)).toBeInTheDocument();
    });
  });
});

describe("CommentSection", () => {
  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ comments: [], total: 0 }),
        headers: new Headers(),
        redirected: false,
        statusText: "OK",
        type: "basic",
        url: "",
      });
    });
  });
  it("should load comments from fetch", async () => {
    const { getByText } = renderWithProviders(<CommentSection />);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    await act(async () => {
      expect(getByText("Loading comments...")).toBeInTheDocument();
      await new Promise((r) => setTimeout(r, 4000));
    });

    expect(getByText("Be the first to comment!")).toBeInTheDocument();
  });
});
