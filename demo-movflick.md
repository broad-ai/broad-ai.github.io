---
layout: demo-movflick
title: BroadAI Demonstration | MovFlick
description: Drawn from a typical streaming service, this app will help you find your pick(s) for the day and even create your own plot!
---

<div class="container mt-5">
    <div class="row">
      <!-- Random Pick -->
      <div class="col-12 col-md-3">
        <div id="random-pick">
          <div class="row">
            <div class="col-12">
              <div class="row mt-5">
                <div class="col-12 text-center">
                  <button class="btn btn-info" type="button" id="btnWriteNewStory" onclick="writeSimilarStory()">Create
                    Story</button>
                  <p><small>inspired by this plot</small></p>
                </div>
              </div>
              <div class="card">
                <img id="pickPoster"
                  src="assets/images/popcorn-576599_1280.png"
                  class="card-img-top" alt="...">
                <div class="card-body">
                  <p class="row card-text">
                    <span class="col-6 text-left">
                      <img
                        src="assets/images/star.png" style="height:1em;"
                        alt="IMDB rating">
                      <span id="pickRating">0.0</span>
                    </span>
                    <span class="col-6 text-right">
                      <span id="pickYear">0000</span>
                    </span>
                  </p>
                  <h2 class="card-title">
                    <span id="pickTitle">Loading...</span>
                  </h2>
                  <h4 class="card-title">
                    <strong>Directed by: </strong>
                    <span id="pickDirector">...</span>
                  </h4>
                </div>
                <div class="px-3 py-3" id="plot"><!-- movie plot here --></div>
              </div>
              <div class="row mt-3">
                <div class="col-12 text-center">
                  <button class="btn btn-primary" type="button" id="btnFindSimilarMovies"
                    onclick="findSimilarMovies()">Similar Movies</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Story -->
      <div class="col-12 col-md-9">
        <div id="story"><!-- new story --></div>
      </div>
    </div>
  </div>
