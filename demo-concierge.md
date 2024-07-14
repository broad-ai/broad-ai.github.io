---
layout: demo
title: BroadAI Demonstration | Concierge
---

<div class="container mt-5">
  <div class="row">
    <div class="col-12 col-md-5 py-2">
      <h4>Trip type:</h4>
      <div class="d-flex px-2">
        <div class="form-check mx-2">
          <input class="form-check-input" type="radio" name="tripType" id="radioBusiness" onchange="updateTask()">
          <label class="form-check-label" for="radioBusiness">
            Business
          </label>
        </div>
        <div class="form-check mx-2">
          <input class="form-check-input" type="radio" name="tripType" id="radioPersonal" onchange="updateTask()">
          <label class="form-check-label" for="radioPersonal">
            Personal
          </label>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-3 py-3">
      <input type="text" class="form-control py-4" id="originCity" placeholder="Origin city" onkeyup="updateTask()">
    </div>
    <div class="col-12 col-md-3 py-3">
      <input type="text" class="form-control py-4" id="destinationCity" placeholder="Destination city"
        onkeyup="updateTask()">
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-md-12 py-0" id="instructions">
      <!-- additional details -->
    </div>
    <div class="col-12 col-md-11 py-2">
      <textarea class="form-control py-4" id="notes" placeholder="Additional notes / requirements for your trip"
        rows="3" onkeyup="updateTask()"></textarea>
    </div>
    <div class="col-12 col-md-1 py-3">
      <button class="btn btn-lg btn-primary" id="btnGoConcierge" onclick="goConcierge()">Submit</button>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-md-12">
      <input type="hidden" class="form-control" id="task">
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-md-8">
      <div id="results"><!-- Results --></div>
    </div>
    <div class="col-12 col-md-4">
      <div id="plan" style="font-weight:100;color:#eee;"><!-- Plan --></div>
    </div>
  </div>
</div>

---
