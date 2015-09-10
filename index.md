---
layout: page
title: StashCache
tagline: Caching your files like it's 1999
---
{% include JB/setup %}

<section>

<div class="row">
  
  <div class="col-sm-6">
    <table id="averagequality" class="table table-bordered table-condensed qualitymap">
      <caption>Average Download Speed</caption>
      <tr>
        <th>Site</th>
        <th>Average Download Speed (Mbit/s)</th>
      </tr>
    </table>
  </div>
  <div class="col-sm-6">
    <div class="chart">
    </div>
  </div>
</div>

<div class="row">
  <div class="col-sm-6">
    <p>
      Data calculated with the <a href="https://stashcache-tester.readthedocs.org">StashCache Tester</a>
    </p>
    <p>
      Cache service history avaiable on <a href="http://myosg.grid.iu.edu/rgstatushistory/index?downtime_attrs_showpast=&account_type=cumulative_hours&ce_account_type=gip_vo&se_account_type=vo_transfer_volume&bdiitree_type=total_jobs&bdii_object=service&bdii_server=is-osg&start_type=7daysago&end_type=now&all_resources=on&facility_sel%5B%5D=10009&gridtype=on&gridtype_1=on&service=on&service_sel%5B%5D=142&active=on&active_value=1&disable_value=1">MyOSG</a>.
    </p>
  </div>
  <div class="col-sm-6">
    Last updated at <div id="updatedat"></div>
  </div>
</div>



</section>
