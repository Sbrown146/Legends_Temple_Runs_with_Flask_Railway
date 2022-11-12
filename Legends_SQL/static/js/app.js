
// Tracker variables for route combinations -> UNUSED
var team_route_tracker = "All_Teams";
var season_route_tracker = "0";
var layout_route_tracker = "0";
var pendant_route_tracker = "0";
var solo_route_tracker = "Both";
var default_array = [];
var test_array = [];
var filter_array = [];
var default_init = 0;
var combine_route_data = 1;


// Initiate on page startup
function init() {
  
  d3.json("/season", function(error, data) {
    if (error) return console.warn(error);
    
    var selector = d3.select("#Season_select");

    selector.append("option").text("All Seasons").property("value", 0);

    data.forEach((season) => {
    selector.append("option").text(`Season ${season}`).property("value", season);
    })
  })

  d3.json("/temple_layout", function(error, data) {
    if (error) return console.warn(error);

    var selector = d3.select("#Temple_select");

    selector.append("option").text("All Layouts").property("value", 0);

    data.sort(function(a, b){return a-b});
    let numerials=["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

    data.forEach((layout) => {
    selector.append("option").text(`${numerials[layout]}`).property("value", layout);
    })
  })

  d3.json("/pendants", function(error, data) {
    if (error) return console.warn(error);

    var selector = d3.select("#Pendants_select");

    selector.append("option").text("All").property("value", 0);

    data.sort(function(a, b){return a-b});
    let pendants_list=["0", "1", "1 1/2", "1 1/2 + 1/2", "2"];

    data.forEach((pendant) => {
    selector.append("option").text(`${pendants_list[pendant]}`).property("value", pendant);
    })
  })

  d3.json("/solo", function(error, data) {
    if (error) return console.warn(error);

    var selector = d3.select("#Solo_select");

    selector.append("option").text("Both").property("value", "Both");

    data.forEach((team) => {
    selector.append("option").text(`${team}`).property("value", team);
    })
  })

  d3.json("/team", function(error, data) {
    if (error) return console.warn(error);

    var selector = d3.select("#Team_select");

    selector.append("option").text("All Teams").property("value", "All_Teams");

    data.forEach((teams) => {
    selector.append("option").text(`${teams}`).property("value", `${teams}`);
    })
  })

};

// Default team options
function default_teams(){
  
  d3.json("/default", function(error, data) {
    if (error) return console.warn(error);

    team_route_tracker = "All_Teams"
    season_route_tracker = 0
    layout_route_tracker = 0
    pendant_route_tracker = 0
    solo_route_tracker = "Both"

    console.log(team_route_tracker, season_route_tracker, layout_route_tracker, pendant_route_tracker, solo_route_tracker);

    // Initiate a reference array for the default data on startup for other routes
    if (default_init === 0) {
      for (let i=0; i < data.success.length; i++) {
        default_array.push({'artifact_found': data.artifact_found[i], 'artifact_location': data.artifact_location[i], 'episode': data.episode[i],  'failure_due_to': data.failure_due_to[i], 'name': data.name[i], 'pen_dummy': data.pen_dummy[i], 'pendants': data.pendants[i], 'season': data.season[i], 'solo': data.solo[i], 'success': data.success[i], 'team': data.team[i], 'temple_layout': data.temple_layout[i], 'time_left': data.time_left[i]});
      };
      default_init = 1;
    };

    
    d3.select("#sample-metadata").html("");
    d3.select("#team-metadata").html("");
    d3.select(".panel-title").html("Stats for: ");
    
    let default_runs=data.season;
    let default_victory=data.success;
    let default_artifact_found=data.artifact_found;
    let default_failed_escape=data.failure_due_to;
    let default_failed_acq=data.failure_due_to;
    let default_triple_seizure=data.failure_due_to;
    let default_time=data.time_left;
    let default_time_sum=0;
    //let default_teams=data.team;

    // Rework at some point to utilize two dimensional array filtering.
    // let team_array=[[default_teams, default_victory]];

    // let red_runs=[];
    // let red_wins=[];
    // let blue_runs=[];
    // let blue_wins=[];
    // let green_runs=[];
    // let green_wins=[];
    // let orange_runs=[];
    // let orange_wins=[];
    // let purple_runs=[];
    // let purple_wins=[];
    // let silver_runs=[];
    // let silver_wins=[];

  
    default_victory=default_victory.filter(success => success=="yes");
    default_artifact_found=default_artifact_found.filter(artifact => artifact=="yes");
    default_failed_escape=default_failed_escape.filter(failure => failure=="Failed Escape");
    default_failed_acq=default_failed_acq.filter(failure => failure=="Failed Acquisition");
    default_triple_seizure=default_triple_seizure.filter(failure => failure=="Triple Seizure");
    default_time=default_time.filter(time => time!=0);
    default_time=default_time.map(function(time){ return parseInt(time, 10); });
    default_time_sum=default_time.reduce(function(a ,b){ return a + b });

    //Fix default_time sum later
   
    d3.select(".panel-title").text(`Stats for: All Teams`);
    d3.select("#sample-metadata").append("h5").text(`Temple Runs: ${default_runs.length}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Victories: ${default_victory.length}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Success Rate: ${(((default_victory.length)/(default_runs.length))*100).toFixed(0)}%`);
    d3.select("#sample-metadata").append("h5").text(`Artifact Found Rate: ${((default_artifact_found.length/default_runs.length)*100).toFixed(1)}%`);
    d3.select("#sample-metadata").append("h5").text(`Average Winning Time: ${(default_time_sum/default_time.length).toFixed(2)} seconds`);

    // Rework these at some point.
    d3.select("#team-metadata").append("h5").text(`Most Wins: 8 -> Silver Snakes, Green Monkeys`);
    d3.select("#team-metadata").append("h5").text(`Fewest Wins: 3 -> Purple Parrots`);
    d3.select("#team-metadata").append("h5").text(`Most Temple Runs: 25 -> Orange Iguanas`);
    d3.select("#team-metadata").append("h5").text(`Fewest Temple Runs: 11 -> Purple Parrots`);
    d3.select("#team-metadata").append("h5").text(`Best Win %: ${((8/21)*100).toFixed(2)}% -> Silver Snakes`);
    d3.select("#team-metadata").append("h5").text(`Worst Win %: ${((4/25)*100).toFixed(2)}% -> Orange Iguanas`);

    
    // Pie Chart
    
    var trace_default_pie={
      type: "pie",
      values: [default_victory.length, default_failed_escape.length, default_failed_acq.length, default_triple_seizure.length],
      labels: ['Successful Temple Runs', 'Temple Run Failure: Failed Escape', 'Temple Run Failure: Failed Acquisition', 'Temple Run Failure: Triple Seizure'],
      pull: [0.1, 0, 0, 0, ],
      marker: {
        colors: ['rgb(20, 156, 88)', 'rgb(138, 83, 0)', 'rgb(223, 238, 11)', 'rgb(238, 11, 11)']
      },
      showlegend: false
    };
    var layout_default_pie={
      title: { 
        text: `Temple Run Success: All Teams`,
        font: {
            color: "white",
            size: 24
        },
      },
      height: 600,
      width: 600,
      paper_bgcolor: "rgba(0,0,0,0)"
    };
    var data_default_pie=[trace_default_pie];

    Plotly.newPlot('pie', data_default_pie, layout_default_pie);


    //Guage Plot

    var degrees=180-((default_time_sum/default_victory.length).toFixed(2)), radius=.5;

    var radians=degrees*Math.PI/180;
    var x=radius*Math.cos(radians);
    var y=radius*Math.sin(radians);

    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';

    var mainPath = path1, pathX = String(x), space = ' ', pathY =String(y), pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ 
      type: 'scatter',
      x: [0], y:[0],
      marker: {size: 14, color:'rgb(255,0,0)'},
      showlegend: false,
      name: 'Seconds',
      text: `${(((default_time_sum/default_victory.length).toFixed(2)))} seconds`,
      hoverinfo: `text`},
      { values: [1,1,1,3],
    rotation: 90,
    text: [`2:01-3:00`, `1:01-2:00`, `0:00-1:00`, ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgb(0, 230, 0)','rgb(255,255,26)', 'rgb(255,70,70)','rgba(0,0,0,0)']},
    labels: [`First 60 Seconds`, `Middle 60 Seconds`, `Final 60 Seconds`, ``],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }];

    var layout = {
    shapes:[{
      type: 'path',
      path: path,
      fillcolor: 'rgb(255,0,0)',
      line: {
        color: 'rgb(255,0,0)'
      }
    }],
    title: { 
      text: "Average Winning Time",
      font: {
          color: "white",
          size: 24
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: 'rgba(0,0,0,0)',
    //paper_bgcolor: "rgb(0, 0, 0)",
    height: 400,
    width: 400,
    xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout, {displayModeBar: false});


    //Bubble plot
    //x and y are placeholders
    var x = 30;
    var trace_bubble={
      x: [20, 19, 24, 25, 11, 21],
      y: [4, 5, 8, 4, 3, 8],
      text: ['Red Jaguars Victories', 'Blue Barracudas Victories', 'Green Monkeys Victories', 'Orange Iguanas Victores', 'Purple Parrots Victories', 'Silver Snakes Victories'],
      mode: 'markers',
      marker: {
        color: ['rgb(98,0,0)', 'rgb(35, 121, 233)', 'rgb(39, 82, 75)', 'rgb(218, 121, 4)', 'rgb(89,45,134)', 'rgb(212, 212, 212)'],
        opacity: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, ],
        size: [4*x, 5*x, 8*x, 4*x, 3*x, 8*x]
      //size: [20,20,20,20,20,20]
      }
    };
    var data_bubble=[trace_bubble];

    var layout_bubble = {
      title: { 
        text: "Team Temple Runs vs Wins",
        font: {
            color: "white",
            size: 24
        },
      },
      images: [ 
        {
          x: .59,
          y: .3,
          sizex: 0.15,
          sizey: 0.15,
          source: "https://vignette.wikia.nocookie.net/legends/images/b/b8/Blue_Barracudas.jpg",
          xanchor: "right",
          xref: "paper",
          yanchor: "bottom",
          yref: "paper"
        },
        {
          x: .63,
          y: .198,
          sizex: 0.1,
          sizey: 0.1,
          source: "https://vignette.wikia.nocookie.net/legends/images/f/fe/Red_Jaguars.png",
          xanchor: "right",
          xref: "paper",
          yanchor: "bottom",
          yref: "paper"
        },
        {
          x: .88,
          y: .198,
          sizex: 0.1,
          sizey: 0.1,
          source: "https://vignette.wikia.nocookie.net/legends/images/8/85/Orange_Iguanas.jpg",
          xanchor: "right",
          xref: "paper",
          yanchor: "bottom",
          yref: "paper"
        },
        {
          x: .174,
          y: .085,
          sizex: 0.08,
          sizey: 0.08,
          source: "https://vignette.wikia.nocookie.net/legends/images/e/e8/Purple_Parrots.jpg",
          xanchor: "right", 
          xref: "paper",
          yanchor: "bottom",
          yref: "paper"
        },
        {
          x: .88,
          y: .66,
          sizex: 0.18,
          sizey: 0.18,
          source: "https://vignette.wikia.nocookie.net/legends/images/b/bc/Green_Monkeys.jpg",
          xanchor: "right",
          xref: "paper",
          yanchor: "bottom",
          yref: "paper"
        },
        {
          x: .67,
          y: .66,
          sizex: 0.18,
          sizey: 0.18,
          source: "https://vignette.wikia.nocookie.net/legends/images/9/9e/Silver_Snakes.jpg",
          xanchor: "right",
          xref: "paper",
          yanchor: "bottom",
          yref: "paper"
        }
      ],
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: 'rgba(0,0,0,0.5)',
    //paper_bgcolor: "rgb(0, 0, 0)",
    showlegend: false,
    height: 750,
    xaxis: { showline: true, color: "white", range: [8, 28], title: { text: "Temple Runs", font: {color: "white", size: 16}}, tickfont: { color: "white"}},
    yaxis: {  showline: true, color: "white", range: [2, 10],title: { text: "Temple Run Victories", font: {color: "white", size: 16}}, tickfont: { color: "white"}}
    };
  
    Plotly.newPlot('bubble', data_bubble, layout_bubble); //{displayModeBar: false});//Bubble plot

  })
}

//Team Dropdown options
function option_Team(different_selection) {
  d3.json("/team/"+different_selection, function(error, data) {
    if (error) return console.warn(error);

    team_route_tracker = different_selection;
    console.log(team_route_tracker, season_route_tracker, layout_route_tracker, pendant_route_tracker, solo_route_tracker);

    if (team_route_tracker==="All_Teams" && season_route_tracker===0 && layout_route_tracker===0 && pendant_route_tracker===0 && solo_route_tracker==="Both") {
      default_teams();
    }
    else {
      d3.select("#sample-metadata").html("");
      d3.select(".panel-title").html("Stats for: ");
    
    
    let team_runs=data.season;
    let team_victory=data.success;
    let team_artifact_found=data.artifact_found;
    let team_failed_escape=data.failure_due_to;
    let team_failed_acq=data.failure_due_to;
    let team_triple_seizure=data.failure_due_to;
    let team_time=data.time_left;
    let team_time_sum=0;

    // Array for further option filteration -> DO NOT USE
    test_array = [];
    filter_array = [];
    for (let i=0; i < data.success.length; i++) {
      test_array.push({'artifact_found': data.artifact_found[i], 'artifact_location': data.artifact_location[i], 'episode': data.episode[i],  'failure_due_to': data.failure_due_to[i], 'name': data.name[i], 'pen_dummy': data.pen_dummy[i], 'pendants': data.pendants[i], 'season': data.season[i], 'solo': data.solo[i], 'success': data.success[i], 'team': data.team[i], 'temple_layout': data.temple_layout[i], 'time_left': data.time_left[i]});
    };

    // console.log(default_array);
    // console.log(test_array);
    // console.log(test_array.filter(e => {return e.season===season_route_tracker && e.temple_layout===layout_route_tracker && e.pendants===pendant_route_tracker && e.solo===solo_route_tracker;}));
    // console.log(test_array.filter(e => {return e.success==='yes' && e.time_left>9;}));
    // console.log(default_array.filter(e => {return e.team===team_route_tracker && e.success==='yes' && e.time_left>9;}));

    // function team_route_filter(tr, tv, taf, tfe, tfa, tts, tt, tts) {
    //   if (season_route_tracker===0 && layout_route_tracker===0 && pendant_route_tracker===0 && solo_route_tracker==="Both") {
    //     tr=data.season;
    //     tv=data.success;
    //     taf=data.artifact_found;
    //     tfe=data.failure_due_to;
    //     tfa=data.failure_due_to;
    //     tts=data.failure_due_to;
    //     tt=data.time_left;
    //     tts=0;
    //   }
    //   else if (season_route_tracker!=0 && layout_route_tracker===0 && pendant_route_tracker===0 && solo_route_tracker==="Both") {
    //     let test_array = test_array.filter(e => {return e.season!=season_route_tracker && e.temple_layout===layout_route_tracker && e.pendants===pendant_route_tracker && e.solo===solo_route_tracker;});
    //     tr=test_array.season;
    //     tv=test_array.success;
    //     taf=test_array.artifact_found;
    //     tfe=test_array.failure_due_to;
    //     tfa=test_array.failure_due_to;
    //     tts=test_array.failure_due_to;
    //     tt=test_array.time_left;
    //     tts=0;
    //   }
    // };

  
    team_victory=team_victory.filter(success => success=="yes");
    team_artifact_found=team_artifact_found.filter(artifact => artifact=="yes");
    team_failed_escape=team_failed_escape.filter(failure => failure=="Failed Escape");
    team_failed_acq=team_failed_acq.filter(failure => failure=="Failed Acquisition");
    team_triple_seizure=team_triple_seizure.filter(failure => failure=="Triple Seizure");
    team_time=team_time.filter(time => time!=0);
    team_time=team_time.map(function(time){ return parseInt(time, 10); });
    team_time_sum=team_time.reduce(function(a ,b){ return a + b });

    d3.select(".panel-title").text(`Stats for: ${different_selection}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Runs: ${team_runs.length}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Victories: ${team_victory.length}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Success Rate: ${(((team_victory.length)/(team_runs.length))*100).toFixed(0)}%`);
    d3.select("#sample-metadata").append("h5").text(`Artifact Found Rate: ${((team_artifact_found.length/team_runs.length)*100).toFixed(1)}%`);
    d3.select("#sample-metadata").append("h5").text(`Average Winning Time: ${(team_time_sum/team_time.length).toFixed(2)} seconds`);

    
    // Pie Chart
    
    var trace_team_pie={
      type: "pie",
      values: [team_victory.length, team_failed_escape.length, team_failed_acq.length, team_triple_seizure.length],
      labels: ['Successful Temple Runs', 'Temple Run Failure: Failed Escape', 'Temple Run Failure: Failed Acquisition', 'Temple Run Failure: Triple Seizure'],
      pull: [0.1, 0, 0, 0, ],
      marker: {
        colors: ['rgb(20, 156, 88)', 'rgb(138, 83, 0)', 'rgb(223, 238, 11)', 'rgb(238, 11, 11)']
      },
      showlegend: false
    };
    var layout_team_pie={
      title: { 
        text: `Temple Run Success: Team ${different_selection}`,
        font: {
            color: "white",
            size: 24
        },
      },
      height: 600,
      width: 600,
      paper_bgcolor: "rgba(0,0,0,0)"
    };
    var data_team_pie=[trace_team_pie];

    Plotly.newPlot('pie', data_team_pie, layout_team_pie);


    //Guage Plot

    var degrees=180-((team_time_sum/team_victory.length).toFixed(2)), radius=.5;

    var radians=degrees*Math.PI/180;
    var x=radius*Math.cos(radians);
    var y=radius*Math.sin(radians);

    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';

    var mainPath = path1, pathX = String(x), space = ' ', pathY =String(y), pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ 
      type: 'scatter',
      x: [0], y:[0],
      marker: {size: 14, color:'rgb(255,0,0)'},
      showlegend: false,
      name: 'Seconds',
      text: `${(((team_time_sum/team_victory.length).toFixed(2)))} seconds`,
      hoverinfo: `text`},
      { values: [1,1,1,3],
    rotation: 90,
    text: [`2:01-3:00`, `1:01-2:00`, `0:00-1:00`, ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgb(0, 230, 0)','rgb(255,255,26)', 'rgb(255,70,70)','rgba(0,0,0,0)']},
    labels: [`First 60 Seconds`, `Middle 60 Seconds`, `Final 60 Seconds`, ``],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }];

    var layout = {
    shapes:[{
      type: 'path',
      path: path,
      fillcolor: 'rgb(255,0,0)',
      line: {
        color: 'rgb(255,0,0)'
      }
    }],
    title: { 
      text: "Average Winning Time",
      font: {
          color: "white",
          size: 24
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: 'rgba(0,0,0,0)',
    //paper_bgcolor: "rgb(0, 0, 0)",
    height: 400,
    width: 400,
    xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout, {displayModeBar: false});

  }
  })
};

// Season Dropdown options
function option_Season(different_selection) {
  d3.json("/season/"+different_selection, function(error, data) {
    if (error) return console.warn(error);

    season_route_tracker = different_selection;
    console.log(team_route_tracker, season_route_tracker, layout_route_tracker, pendant_route_tracker, solo_route_tracker);

    if (different_selection==0){
      default_teams();
      }
    else{
      d3.select("#sample-metadata").html("");
      d3.select(".panel-title").html("Stats for: ");
    
    
    let season_runs=data.season;
    let season_victory=data.success;
    let season_artifact_found=data.artifact_found;
    let season_failed_escape=data.failure_due_to;
    let season_failed_acq=data.failure_due_to;
    let season_triple_seizure=data.failure_due_to;
    let season_time=data.time_left;
    let season_time_sum=0;
  
    season_victory=season_victory.filter(success => success=="yes");
    season_artifact_found=season_artifact_found.filter(artifact => artifact=="yes");
    season_failed_escape=season_failed_escape.filter(failure => failure=="Failed Escape");
    season_failed_acq=season_failed_acq.filter(failure => failure=="Failed Acquisition");
    season_triple_seizure=season_triple_seizure.filter(failure => failure=="Triple Seizure");
    season_time=season_time.filter(time => time!=0);
    season_time=season_time.map(function(time){ return parseInt(time, 10); });
    season_time_sum=season_time.reduce(function(a ,b){ return a + b });

    d3.select(".panel-title").text(`Stats for: Season ${different_selection}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Runs: ${season_runs.length}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Victories: ${season_victory.length}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Success Rate: ${(((season_victory.length)/(season_runs.length))*100).toFixed(0)}%`);
    d3.select("#sample-metadata").append("h5").text(`Artifact Found Rate: ${((season_artifact_found.length/season_runs.length)*100).toFixed(1)}%`);
    d3.select("#sample-metadata").append("h5").text(`Average Winning Time: ${(season_time_sum/season_time.length).toFixed(2)} seconds`);

    
    // Pie Chart
    
    var trace_season_pie={
      type: "pie",
      values: [season_victory.length, season_failed_escape.length, season_failed_acq.length, season_triple_seizure.length],
      labels: ['Successful Temple Runs', 'Temple Run Failure: Failed Escape', 'Temple Run Failure: Failed Acquisition', 'Temple Run Failure: Triple Seizure'],
      pull: [0.1, 0, 0, 0, ],
      marker: {
        colors: ['rgb(20, 156, 88)', 'rgb(138, 83, 0)', 'rgb(223, 238, 11)', 'rgb(238, 11, 11)']
      },
      showlegend: false
    };
    var layout_season_pie={
      title: { 
        text: `Temple Run Success: Season ${different_selection}`,
        font: {
            color: "white",
            size: 24
        },
      },
      height: 600,
      width: 600,
      paper_bgcolor: "rgba(0,0,0,0)"
    };
    var data_season_pie=[trace_season_pie];

    Plotly.newPlot('pie', data_season_pie, layout_season_pie);


    //Guage Plot

    var degrees=180-((season_time_sum/season_victory.length).toFixed(2)), radius=.5;

    var radians=degrees*Math.PI/180;
    var x=radius*Math.cos(radians);
    var y=radius*Math.sin(radians);

    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';

    var mainPath = path1, pathX = String(x), space = ' ', pathY =String(y), pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ 
      type: 'scatter',
      x: [0], y:[0],
      marker: {size: 14, color:'rgb(255,0,0)'},
      showlegend: false,
      name: 'Seconds',
      text: `${(((season_time_sum/season_victory.length).toFixed(2)))} seconds`,
      hoverinfo: `text`},
      { values: [1,1,1,3],
    rotation: 90,
    text: [`2:01-3:00`, `1:01-2:00`, `0:00-1:00`, ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgb(0, 230, 0)','rgb(255,255,26)', 'rgb(255,70,70)','rgba(0,0,0,0)']},
    labels: [`First 60 Seconds`, `Middle 60 Seconds`, `Final 60 Seconds`, ``],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }];

    var layout = {
    shapes:[{
      type: 'path',
      path: path,
      fillcolor: 'rgb(255,0,0)',
      line: {
        color: 'rgb(255,0,0)'
      }
    }],
    title: { 
      text: "Average Winning Time",
      font: {
          color: "white",
          size: 24
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: 'rgba(0,0,0,0)',
    //paper_bgcolor: "rgb(0, 0, 0)",
    height: 400,
    width: 400,
    xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout, {displayModeBar: false});

  }
  })
};

// Temple Layout Dropdown options
function option_Layout(different_selection) {
  d3.json("/temple_layout/"+different_selection, function(error, data) {
    if (error) return console.warn(error);

    layout_route_tracker = different_selection;
    console.log(team_route_tracker, season_route_tracker, layout_route_tracker, pendant_route_tracker, solo_route_tracker);

    if (different_selection==0){
      default_teams();
      }
    else{
      d3.select("#sample-metadata").html("");
      d3.select(".panel-title").html("Stats for: ");
    

    let temple_runs=data.season;
    let temple_victory=data.success;
    let temple_artifact_found=data.artifact_found;
    let temple_failed_escape=data.failure_due_to;
    let temple_failed_acq=data.failure_due_to;
    let temple_triple_seizure=data.failure_due_to;
    let temple_time=data.time_left;
    let temple_time_sum=0;
  
    temple_victory=temple_victory.filter(success => success=="yes");
    temple_artifact_found=temple_artifact_found.filter(artifact => artifact=="yes");
    temple_failed_escape=temple_failed_escape.filter(failure => failure=="Failed Escape");
    temple_failed_acq=temple_failed_acq.filter(failure => failure=="Failed Acquisition");
    temple_triple_seizure=temple_triple_seizure.filter(failure => failure=="Triple Seizure");
    temple_time=temple_time.filter(time => time!=0);
    temple_time=temple_time.map(function(time){ return parseInt(time, 10); });
    if (temple_time.length===0){
      temple_time_sum=0;
    }
    else {
    temple_time_sum=temple_time.reduce(function(a ,b){ return a + b });
    }

    let numerials=["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

    d3.select(".panel-title").text(`Stats for: Layout ${numerials[different_selection]}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Runs: ${temple_runs.length}`);
    if (temple_victory.length===0){
      d3.select("#sample-metadata").append("h5").text("Temple Victories: 0");
    }
    else {
      d3.select("#sample-metadata").append("h5").text(`Temple Victories: ${temple_victory.length}`);
    }
    d3.select("#sample-metadata").append("h5").text(`Temple Success Rate: ${(((temple_victory.length)/(temple_runs.length))*100).toFixed(2)}%`);
    d3.select("#sample-metadata").append("h5").text(`Artifact Found Rate: ${((temple_artifact_found.length/temple_runs.length)*100).toFixed(1)}%`);
    if (temple_time.length===0){
      d3.select("#sample-metadata").append("h5").text("Average Winning Time: No Winners");
    }
    else {
    d3.select("#sample-metadata").append("h5").text(`Average Winning Time: ${(temple_time_sum/temple_time.length).toFixed(2)} seconds`);
    }

    //Pie graph

    var trace_layout_pie={
      type: "pie",
      values: [temple_victory.length, temple_failed_escape.length, temple_failed_acq.length, temple_triple_seizure.length],
      labels: ['Successful Temple Runs', 'Temple Run Failure: Failed Escape', 'Temple Run Failure: Failed Acquisition', 'Temple Run Failure: Triple Seizure'],
      pull: [0.1, 0, 0, 0, ],
      textposition: 'inside', //Use this if any slices are small or 0.
      marker: {
        colors: ['rgb(20, 156, 88)', 'rgb(138, 83, 0)', 'rgb(223, 238, 11)', 'rgb(238, 11, 11)']
      },
      showlegend: false
    };
    var layout_layout_pie={
      title: { 
        text: `Temple Run Success: Temple Layout ${numerials[different_selection]}`,
        font: {
            color: "white",
            size: 24
        },
      },
      height: 600,
      width: 600,
      paper_bgcolor: "rgba(0,0,0,0)"
    };
    var data_layout_pie=[trace_layout_pie];

    Plotly.newPlot('pie', data_layout_pie, layout_layout_pie);

    //Gauge chart

    if (temple_victory.length===0){
      degrees=180, radius=.5;
      temple_victory=[1];  //Fixed for text for 0 victories in gauge plot.
    }
    else {
      var degrees=180-(((temple_time_sum/temple_victory.length)).toFixed(2)), radius=.5;
    }

    var radians=degrees*Math.PI/180;
    var x=radius*Math.cos(radians);
    var y=radius*Math.sin(radians);

    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';

    var mainPath = path1, pathX = String(x), space = ' ', pathY =String(y), pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data_layout_gauge = [{ 
      type: 'scatter',
      x: [0], y:[0],
      marker: {size: 14, color:'rgb(255,0,0)'},
      showlegend: false,
      name: 'Seconds',  
      text: `${(((temple_time_sum/temple_victory.length)).toFixed(2))} seconds`,
      hoverinfo: `text`},
      { values: [1,1,1,3],
    rotation: 90,
    text: [`2:01-3:00`, `1:01-2:00`, `0:00-1:00`, ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgb(0, 230, 0)','rgb(255,255,26)', 'rgb(255,70,70)','rgba(0,0,0,0)']},
    labels: [`First 60 Seconds`, `Middle 60 Seconds`, `Final 60 Seconds`, ``],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }];

    var layout_layout_gauge = {
    shapes:[{
      type: 'path',
      path: path,
      fillcolor: 'rgb(255,0,0)',
      line: {
        color: 'rgb(255,0,0)'
      }
    }],
    title: { 
      text: "Average Winning Time",
      font: {
          color: "white",
          size: 24
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: 'rgba(0,0,0,0)',
    //paper_bgcolor: "rgb(0, 0, 0)",
    height: 400,
    width: 400,
    xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data_layout_gauge, layout_layout_gauge, {displayModeBar: false}); 

  }
  })
};

//Pendants Dropdown options
function option_Pendants(different_selection) {
  d3.json("/pendants/"+different_selection, function(error, data) {
    if (error) return console.warn(error);

    pendant_route_tracker = different_selection;
    console.log(team_route_tracker, season_route_tracker, layout_route_tracker, pendant_route_tracker, solo_route_tracker);

    if (different_selection==0){
      default_teams();
      }
    else{
      d3.select("#sample-metadata").html("");
      d3.select(".panel-title").html("Stats for: ");
    
    
    let pendants_runs=data.season;
    let pendants_victory=data.success;
    let pendants_artifact_found=data.artifact_found;
    let pendants_failed_escape=data.failure_due_to;
    let pendants_failed_acq=data.failure_due_to;
    let pendants_triple_seizure=data.failure_due_to;
    let pendants_time=data.time_left;
    let pendants_time_sum=0;
  
    pendants_victory=pendants_victory.filter(success => success=="yes");
    pendants_artifact_found=pendants_artifact_found.filter(artifact => artifact=="yes");
    pendants_failed_escape=pendants_failed_escape.filter(failure => failure=="Failed Escape");
    pendants_failed_acq=pendants_failed_acq.filter(failure => failure=="Failed Acquisition");
    pendants_triple_seizure=pendants_triple_seizure.filter(failure => failure=="Triple Seizure");
    pendants_time=pendants_time.filter(time => time!=0);
    pendants_time=pendants_time.map(function(time){ return parseInt(time, 10); });
    pendants_time_sum=pendants_time.reduce(function(a ,b){ return a + b });

    let pendants_list=["0", "1", "1 1/2", "1 1/2 + 1/2", "2"];

    d3.select(".panel-title").text(`Stats for: ${pendants_list[different_selection]} Pendants`);
    d3.select("#sample-metadata").append("h5").text(`Temple Runs: ${pendants_runs.length}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Victories: ${pendants_victory.length}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Success Rate: ${(((pendants_victory.length)/(pendants_runs.length))*100).toFixed(0)}%`);
    d3.select("#sample-metadata").append("h5").text(`Artifact Found Rate: ${((pendants_artifact_found.length/pendants_runs.length)*100).toFixed(1)}%`);
    d3.select("#sample-metadata").append("h5").text(`Average Winning Time: ${(pendants_time_sum/pendants_time.length).toFixed(2)} seconds`);

    //pie graph

    var trace_pendant_pie={
      type: "pie",
      values: [pendants_victory.length, pendants_failed_escape.length, pendants_failed_acq.length, pendants_triple_seizure.length],
      labels: ['Successful Temple Runs', 'Temple Run Failure: Failed Escape', 'Temple Run Failure: Failed Acquisition', 'Temple Run Failure: Triple Seizure'],
      pull: [0.1, 0, 0, 0, ],
      textposition: 'inside', //Use this if any slices are small or 0.
      marker: {
        colors: ['rgb(20, 156, 88)', 'rgb(138, 83, 0)', 'rgb(223, 238, 11)', 'rgb(238, 11, 11)']
      },
      showlegend: false
    };
    var layout_pendant_pie={
      title: { 
        text: `Temple Run Success: ${pendants_list[different_selection]} Pendants Runs`,
        font: {
            color: "white",
            size: 23
        },
      },
      height: 600,
      width: 600,
      paper_bgcolor: "rgba(0,0,0,0)"
    };
    var data_pendant_pie=[trace_pendant_pie];

    Plotly.newPlot('pie', data_pendant_pie, layout_pendant_pie);


    //Guage Plot

    var degrees=180-((pendants_time_sum/pendants_victory.length).toFixed(2)), radius=.5;

    var radians=degrees*Math.PI/180;
    var x=radius*Math.cos(radians);
    var y=radius*Math.sin(radians);

    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';

    var mainPath = path1, pathX = String(x), space = ' ', pathY =String(y), pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ 
      type: 'scatter',
      x: [0], y:[0],
      marker: {size: 14, color:'rgb(255,0,0)'},
      showlegend: false,
      name: 'Seconds',
      text: `${(((pendants_time_sum/pendants_victory.length).toFixed(2)))} seconds`,
      hoverinfo: `text`},
      { values: [1,1,1,3],
    rotation: 90,
    text: [`2:01-3:00`, `1:01-2:00`, `0:00-1:00`, ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgb(0, 230, 0)','rgb(255,255,26)', 'rgb(255,70,70)','rgba(0,0,0,0)']},
    labels: [`First 60 Seconds`, `Middle 60 Seconds`, `Final 60 Seconds`, ``],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }];

    var layout = {
    shapes:[{
      type: 'path',
      path: path,
      fillcolor: 'rgb(255,0,0)',
      line: {
        color: 'rgb(255,0,0)'
      }
    }],
    title: { 
      text: "Average Winning Time",
      font: {
          color: "white",
          size: 24
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: 'rgba(0,0,0,0)',
    //paper_bgcolor: "rgb(0, 0, 0)",
    height: 400,
    width: 400,
    xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout, {displayModeBar: false});

  }
  })
};

//Solo or Team Dropdown options
function option_Solo(different_selection) {
  d3.json("/solo/"+different_selection, function(error, data) {
    if (error) return console.warn(error);

    solo_route_tracker = different_selection;
    console.log(team_route_tracker, season_route_tracker, layout_route_tracker, pendant_route_tracker, solo_route_tracker);

    if (different_selection==="Both"){
      default_teams();
      }
    else{
      d3.select("#sample-metadata").html("");
      d3.select(".panel-title").html("Stats for: ");
    
    
    let solo_runs=data.season;
    let solo_victory=data.success;
    let solo_artifact_found=data.artifact_found;
    let solo_failed_escape=data.failure_due_to;
    let solo_failed_acq=data.failure_due_to;
    let solo_triple_seizure=data.failure_due_to;
    let solo_time=data.time_left;
    let solo_time_sum=0;
  
    solo_victory=solo_victory.filter(success => success=="yes");
    solo_artifact_found=solo_artifact_found.filter(artifact => artifact=="yes");
    solo_failed_escape=solo_failed_escape.filter(failure => failure=="Failed Escape");
    solo_failed_acq=solo_failed_acq.filter(failure => failure=="Failed Acquisition");
    solo_triple_seizure=solo_triple_seizure.filter(failure => failure=="Triple Seizure");
    solo_time=solo_time.filter(time => time!=0);
    solo_time=solo_time.map(function(time){ return parseInt(time, 10); });
    solo_time_sum=solo_time.reduce(function(a ,b){ return a + b });


    d3.select(".panel-title").text(`Stats for: ${different_selection} Pendants`);
    d3.select("#sample-metadata").append("h5").text(`Temple Runs: ${solo_runs.length}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Victories: ${solo_victory.length}`);
    d3.select("#sample-metadata").append("h5").text(`Temple Success Rate: ${(((solo_victory.length)/(solo_runs.length))*100).toFixed(0)}%`);
    d3.select("#sample-metadata").append("h5").text(`Artifact Found Rate: ${((solo_artifact_found.length/solo_runs.length)*100).toFixed(1)}%`);
    d3.select("#sample-metadata").append("h5").text(`Average Winning Time: ${(solo_time_sum/solo_time.length).toFixed(2)} seconds`);

    //pie graph

    var trace_pendant_pie={
      type: "pie",
      values: [solo_victory.length, solo_failed_escape.length, solo_failed_acq.length, solo_triple_seizure.length],
      labels: ['Successful Temple Runs', 'Temple Run Failure: Failed Escape', 'Temple Run Failure: Failed Acquisition', 'Temple Run Failure: Triple Seizure'],
      pull: [0.1, 0, 0, 0, ],
      textposition: 'inside', //Use this if any slices are small or 0.
      marker: {
        colors: ['rgb(20, 156, 88)', 'rgb(138, 83, 0)', 'rgb(223, 238, 11)', 'rgb(238, 11, 11)']
      },
      showlegend: false
    };
    var layout_pendant_pie={
      title: { 
        text: `Temple Run Success: ${different_selection} Pendants Runs`,
        font: {
            color: "white",
            size: 23
        },
      },
      height: 600,
      width: 600,
      paper_bgcolor: "rgba(0,0,0,0)"
    };
    var data_pendant_pie=[trace_pendant_pie];

    Plotly.newPlot('pie', data_pendant_pie, layout_pendant_pie);


    //Guage Plot

    var degrees=180-((solo_time_sum/solo_victory.length).toFixed(2)), radius=.5;

    var radians=degrees*Math.PI/180;
    var x=radius*Math.cos(radians);
    var y=radius*Math.sin(radians);

    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';

    var mainPath = path1, pathX = String(x), space = ' ', pathY =String(y), pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ 
      type: 'scatter',
      x: [0], y:[0],
      marker: {size: 14, color:'rgb(255,0,0)'},
      showlegend: false,
      name: 'Seconds',
      text: `${(((solo_time_sum/solo_victory.length).toFixed(2)))} seconds`,
      hoverinfo: `text`},
      { values: [1,1,1,3],
    rotation: 90,
    text: [`2:01-3:00`, `1:01-2:00`, `0:00-1:00`, ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgb(0, 230, 0)','rgb(255,255,26)', 'rgb(255,70,70)','rgba(0,0,0,0)']},
    labels: [`First 60 Seconds`, `Middle 60 Seconds`, `Final 60 Seconds`, ``],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }];

    var layout = {
    shapes:[{
      type: 'path',
      path: path,
      fillcolor: 'rgb(255,0,0)',
      line: {
        color: 'rgb(255,0,0)'
      }
    }],
    title: { 
      text: "Average Winning Time",
      font: {
          color: "white",
          size: 24
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: 'rgba(0,0,0,0)',
    //paper_bgcolor: "rgb(0, 0, 0)",
    height: 400,
    width: 400,
    xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout, {displayModeBar: false});

  }
  })
};

init();
default_teams();