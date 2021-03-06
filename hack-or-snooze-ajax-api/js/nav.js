"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage(storyList.stories);
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** Show new story submission form */

function navSubmitClick(e) {
  console.debug("navSubmitClick", e);
  hidePageComponents();
  $submitForm.show();
}

$navSubmit.on('click', navSubmitClick);

function navFavoritesClick(e) {
  console.debug("navFavoritesClick", e);
  hidePageComponents();
  putFavoriteStoriesOnPage();
}

$navFavorites.on('click', navFavoritesClick);

function navMyStoriesClick(e) {
   console.debug('navMyStoriesClick', e);
   hidePageComponents();
   putUserStoriesOnPage();
}

$navMyStories.on('click', navMyStoriesClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
