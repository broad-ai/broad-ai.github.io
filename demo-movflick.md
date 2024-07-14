---
layout: demo
title: BroadAI Demonstration | MovFlick
description: Drawn from a typical streaming service, this app will help you find your pick(s) for the day and even create your own plot!
---

<div class="container mt-5">
    <div class="my-3">
      <button class="btn btn-info" type="button" id="btnPickRandomMovie" onclick="pickRandomMovie()">Recommend</button>
    </div>
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
                  src="https://media.istockphoto.com/id/2052734068/vector/popcorn-box-and-white-background.jpg?s=2048x2048&w=is&k=20&c=ibJQIJSeTH09x0z1KTjoDP8PB8Rd_OuE18Hp1h3MddU="
                  class="card-img-top" alt="...">
                <div class="card-body">
                  <p class="row card-text">
                    <span class="col-6 text-left">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKUcjZf0JSxm1mHIGsYM9vL_VxH0gDxHggyA&s"
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
                  <h6 class="card-title">
                    <strong>Directed by: </strong>
                    <span id="pickDirector">...</span>
                  </h6>
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

---
