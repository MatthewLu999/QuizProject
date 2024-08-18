// create global varibles
function calculatePercentage(scoreObtained, totalScore) {
  if (totalScore === 0) {
      return 0;
  }
  
  const percentage = Math.ceil( (scoreObtained / totalScore) * 100);
  return percentage.toFixed(2);
}

function comeback(){
  window.location.href = "index.html"
}

//create percentage grpah
function create_Percentage_Graph(commonlabel, labelgraph, totalquestionsArray){
//==================
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: commonlabel,
        datasets: [{
            label: labelgraph,
            data: totalquestionsArray,
            fill: false,
            borderColor: 'rgb(0, 0, 204)',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}

//create second  grpah
function create_correctAnswer_Graph(commonlabel, labelgraph, totalquestionsArray){
  //==================
  const ctx = document.getElementById('myChartCorrectAnswers').getContext('2d');
  const myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: commonlabel,
          datasets: [{
              label: labelgraph,
              data: totalquestionsArray,
              fill: false,
              borderColor: 'rgb(255, 0, 102)',
              tension: 0.1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }



$(document).ready(function(){
  var labelgraph = "Your Grades (%)"
  var labelgraph1 = "Grades by Correct Answers"
  var labeforData = []
  var arryGradeHistory = getCookieforArray('gradehistory');
  console.log(arryGradeHistory)
  let correctAnswersArray = []
  let totalquestionsArray = []
  let totalCorrectAnswersArray = []
  arryGradeHistory.forEach(element => {
    var username = element.username
    var percentage = element.totalpercentage
    var totalcorrectquestion = element.totalcorrectquestion
    var totalquestion = element.totalquestion
    var date = element.date
    var yourgrade = calculatePercentage(totalcorrectquestion, totalquestion)
    correctAnswersArray.push(date)
    totalquestionsArray.push(yourgrade)
    totalCorrectAnswersArray.push(totalcorrectquestion)
    // labeforData.push(labelgraph)

    
  });

  //call function to create first grpah for percentage
  create_Percentage_Graph(correctAnswersArray, labelgraph,  totalquestionsArray)

  //create second graph
  create_correctAnswer_Graph(correctAnswersArray, labelgraph1,  totalCorrectAnswersArray)

})



