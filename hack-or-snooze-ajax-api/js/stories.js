"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage(storyList.stories);
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showTrashIcon=false) {
  // console.debug("generateStoryMarkup", story);

  let star = currentUser.favorites.includes(story) ? `<i class="fas fa-star"></i>` : `<i class="far fa-star"></i>` ;


  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}" class="mask">
        <span class="star">${star}</span>
        ${ showTrashIcon ? `<span class="trash"><i class="fas fa-trash"></i></span>` : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Creates user submitted story and adds it to story list */

async function submitStory(e) {
  console.debug('submitStory', e);
  e.preventDefault();
  //submit-title/author/url
  let title = $('#submit-title').val();
  let author = $('#submit-author').val();
  let url = $('#submit-url').val();

  await storyList.addStory(currentUser, {title, author, url});

  putStoriesOnPage();
}

$submitForm.on('submit', submitStory);

async function removeStory(e) {
  console.debug('dltStory', e);

  const storyId = $(e.target).closest('li').attr('id');

  await storyList.dltStory(currentUser, storyId);

  putUserStoriesOnPage();
}

$ownStoriesList.on('click','.trash', removeStory);

function putUserStoriesOnPage() {
  console.debug('putUserStoriesOnPage');

  $ownStoriesList.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStoriesList.append(`<h5>${currentUser.username} hasn't added any stories!</h5>`);
  } else {
    for (let s of currentUser.ownStories) {
      $ownStoriesList.append(generateStoryMarkup(s,true));
    }
  }

  $ownStoriesList.show();
}

function putFavoriteStoriesOnPage() {
  console.debug('putFavoriteStoriesOnPage');

  $favoriteStoriesList.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStoriesList.append(`<h5>${currentUser.username} has no favorite stories!</h5>`)
  } else {
    for (let s of currentUser.favorites) {
      $favoriteStoriesList.append(generateStoryMarkup(s));
    }
  }

  $favoriteStoriesList.show();
}

async function toggleFavoriteStory(e) {
  console.debug('toggleFavoriteStory', e);

  const $star = $(e.target);
  const storyId = $star.closest('li').attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);

  $star.closest('i').toggleClass('fas far');

  if ($star.hasClass('fas')) {            // user just added a favorite!
    await currentUser.addFavorite(story);
  } else {                                // user just removed a favorite
    await currentUser.dltFavorite(story);
  }

  await currentUser._addOrDltFavorite(story);
}

$storiesLists.on('click', '.star', toggleFavoriteStory);