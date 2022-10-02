function differentTeams(homeTeam, guestTeam) {
  var team1 = document.getElementById("homeTeam");
  var team2 = document.getElementById("guestTeam");

  var team1_ID = team1.options[team1.selectedIndex].value;

  var team2_ID = team2.options[team2.selectedIndex].value;

  if(team1_ID != team2_ID) {
    var good2Go = document.getElementById("insertGame");
    good2Go.value = "Submit";
  } else {
    alert("TEAMS MUST BE DIFFERENT");
  }

}