---
layout: page
title: StashCache
tagline: Caching your files like it's 1999
---
{% include JB/setup %}

<section>

<div class="row">
  
  <div class="col-sm-4">
    <table id="averagequality" class="table table-bordered table-condensed qualitymap table-hover">
      <caption>Average Download Speed.  Click to highlight a site in the line graph.</caption>
      <tr>
        <th>Site</th>
        <th>Average Download Speed (Mbit/s)</th>
      </tr>
    </table>
  </div>
  <div class="col-sm-8">
    <div class="chart">
    </div>
  </div>
</div>




<div class="row">
  <div class="col-md-3">
    <h3>Historical Data</h3>
    <p>
      The graph to the right shows the historical download speed of sites in Megabits per second.
      If the graph may be null for some values if the tester fails because either:
      
      <ol>
        <li>Testing jobs are unable to start at the site within the timeout.</li>
        <li>The site failed to run the testing jobs too many times.</li>
      </ol>
      
    </p>
  </div>
  <div class="col-md-9">
    <div id="linechart"></div>
  </div>
</div>

<div class="row">
  <div class="col-sm-6">
    <h3>Caches</h3>
    <table id="cachestable" class="table table-bordered table-condensed qualitymap table-hover">
      <caption>Average Download Speed.  Click to highlight a site in the line graph.</caption>
      <tr>
        <th>Cache</th>
        <th>Average Download Speed (Mbit/s)</th>
      </tr>
    </table>
  </div>
  <div class="col-sm-6">
  </div>
</div>

<div class="row">
  <div class="col-sm-6">
    <p>
      Data calculated with the <a href="https://stashcache-tester.readthedocs.org">StashCache Tester</a>
    </p>
  </div>
  <div class="col-sm-6">
    <p>
      Cache service history avaiable on <a href="http://myosg.grid.iu.edu/rgstatushistory/index?downtime_attrs_showpast=&account_type=cumulative_hours&ce_account_type=gip_vo&se_account_type=vo_transfer_volume&bdiitree_type=total_jobs&bdii_object=service&bdii_server=is-osg&start_type=7daysago&end_type=now&all_resources=on&facility_sel%5B%5D=10009&gridtype=on&gridtype_1=on&service=on&service_sel%5B%5D=142&active=on&active_value=1&disable_value=1">MyOSG</a>.
    </p>
  </div>
</div>


</div>

</section>
