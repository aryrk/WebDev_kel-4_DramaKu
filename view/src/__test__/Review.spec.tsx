import React from "react";
import { act, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Comment, CommentSection } from "../pages/DetailPage";
import { renderWithProviders } from "../utils/test-utils";
import userEvent from "@testing-library/user-event";

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

// describe("CommentSection", () => {
//   beforeEach(() => {
//     const data_comments = [
//       {
//         id: 1,
//         movie_id: 2,
//         user_id: 1,
//         rate: 3,
//         comments:
//           "**Wakanda Forever was an earnest film that tackled some tough themes and honored its hero well but got bogged down introducing vast new worlds and complicated characters.**\r\n\r\nWakanda Forever left me with mixed emotions. The respect and love paid to the legacy of Chadwick Boseman were heartfelt, meaningful, and sincere. The movie wisely grappled with the aftermath of T’Challa’s passing on his family and nation. This subject matter created excellent opportunities to dive deeper into characters like Shuri, Nakia, and even M’Baku. Instead, Wakanda Forever primarily served as a vehicle to introduce Namor and Talokan. The film rightfully embraced a more somber tone as it dealt with themes of loss and legacy, but the mournful spirit caused the plot to sag and drag along throughout most of the runtime. Winston Duke offers the little levity the movie had. The cast delivered exceptionally, with Angela Bassett’s performance as the true standout. I liked the movie, but the melancholy approach made it more difficult to really enjoy, and the introduction of Namor and his threat to Wakanda chewed up so much of the story that it was difficult to bring closure to characters struggling with loss and heartbreak satisfyingly.",
//         comment_date: "2022-11-10T17:00:00.000Z",
//         status: "accepted",
//         created_at: "2024-11-17T08:21:05.000Z",
//         updated_at: "2024-11-17T08:21:05.000Z",
//         deleted_at: null,
//         username: "The Movie Mob",
//         profile_picture:
//           "https://image.tmdb.org/t/p/w92/https://image.tmdb.org/t/p/w92/blEC280vq31MVaDcsWBXuGOsYnB.jpg",
//       },
//       {
//         id: 2,
//         movie_id: 2,
//         user_id: 2,
//         rate: 3,
//         comments:
//           'FULL SPOILER-FREE REVIEW @ https://www.msbreviews.com/movie-reviews/black-panther-wakanda-forever-spoiler-free-review\r\n\r\n"Black Panther: Wakanda Forever may not quite measure up to its predecessor, but it leaves a proud, beautiful, silent tribute to the legacy of Chadwick Boseman, telling an emotionally powerful, resonant story about how grief can truly be love persevering.\r\n\r\nThe screenplay runs into problems when it deviates from the central theme and tries to mix in other MCU stories/characters, with Namor and Riri suffering collateral damage. Technically, the action set pieces are mostly riveting, despite some inconsistent VFX and lighting. Score and sound production stand out in a remarkably memorable manner.\r\n\r\nBrutally passionate, moving performances, especially from Letitia Wright, Angela Bassett, and Danai Gurira. Exquisite pacing reduces the weight of the long runtime.\r\n\r\nTotally worth the emotional investment."\r\n\r\nRating: B+',
//         comment_date: "2022-11-10T17:00:00.000Z",
//         status: "accepted",
//         created_at: "2024-11-17T08:21:05.000Z",
//         updated_at: "2024-11-17T08:21:05.000Z",
//         deleted_at: null,
//         username: "Manuel São Bento",
//         profile_picture: "",
//       },
//       {
//         id: 3,
//         movie_id: 2,
//         user_id: 3,
//         rate: 3,
//         comments:
//           'Mourning the unexplained death of King "T\'Challa", the tech-rich African nation of "Wakanda" returns Queen "Ramonda" (Angela Bassett) to the throne and she must stabilise the kingdom and try to help her daughter "Shuri" (Letitia Wright) deal with the loss of her much-loved brother. A fireside chat late one night doesn\'t quite go to plan though, when they are introduced to an interloper. "Namor" (Tenoch Huerta) arrives to ask their help to thwart the Americans who nave managed to design a machine that can trace vibranium, and this has put his hitherto unknown population of underwater, Mesoamerican, people at risk. Either they help him to track down the scientist who created this or there could be war. The Princess and her general head to Massachusetts where they track down a college student who is almost as much of a whizz-kid as "Shuri". The FBI are on soon their trail and skedaddle they must, straight into the arms of the waiting "Talokan" who take them to their beautiful watery homeland where we learn just how they evolved. Somewhat narked, the Queen wants her daughter back and that action sows the seeds for a conflict between the two nations that, well, you can guess the rest. Sadly, that\'s the problem here. Despite a really strong and vibrant performance from Wright and some very fine production values, there is precious little story here. It is far, far, too long to sustain the thin plot and the conflict engineered between the two races is flawed in more ways than an US Congressional election. The pace is really slow, the combat scenes could have been choreographed by Sir Matthew Bourne - or by a Wakandan cheerleader at their equivalent of the "Superbowl" - and the supporting characters aren\'t on screen long enough to give Miss Wright enough help to wade through the frequent tedium. I wasn\'t helped by Huerta\'s very thick accent which made his dialogue nigh-on impossible to comprehend at times and the denouement screamed sequel so loudly that I forgot that I\'d long given up on any jeopardy at the end two hours ago. There is a bit of character tragedy, character loyalty and thankfully Martin Freeman\'s ("Ross" - why does he need an American accent?) appears but sparingly as we go along but Marvel must stop taking the audience for granted. They have to realise that their gorgeous Avatar-esque visual effects and technical wizardry are not going to entertain us indefinitely if the stories continue to deliver so weakly. Great to look at, a few power-ballads from the soundtrack and Wright is certainly a stylish and classy star - otherwise, this is a film nobody will remember in two years time, I\'ll bet!',
//         comment_date: "2022-11-13T17:00:00.000Z",
//         status: "accepted",
//         created_at: "2024-11-17T08:21:05.000Z",
//         updated_at: "2024-11-17T08:21:05.000Z",
//         deleted_at: null,
//         username: "CinemaSerf",
//         profile_picture:
//           "https://image.tmdb.org/t/p/w92/https://image.tmdb.org/t/p/w92/yz2HPme8NPLne0mM8tBnZ5ZWJzf.jpg",
//       },
//     ];

//     global.fetch = jest.fn((url, options) => {
//       return Promise.resolve({
//         ok: true,
//         status: 200,
//         json: () => Promise.resolve({ comments: data_comments, total: 3 }),
//         headers: new Headers(),
//         redirected: false,
//         statusText: "OK",
//         type: "basic",
//         url: "",
//       });
//     });
//   });
//   it("should load comments from fetch", async () => {
//     const { getByText } = renderWithProviders(<CommentSection />);
//     expect(global.fetch).toHaveBeenCalledTimes(1);
//     await act(async () => {
//       expect(getByText("The Movie Mob")).toBeInTheDocument();
//       expect(getByText("Manuel São Bento")).toBeInTheDocument();
//       expect(getByText("CinemaSerf")).toBeInTheDocument();
//     });
//   });
// });
