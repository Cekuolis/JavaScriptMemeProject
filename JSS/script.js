let pajamos = [];
let nekintamos = [];
let kintamos = [];
let nebutinos = [];
let tekstas = document.getElementById("tekstas");
let response;
let pajamuSuma = 0;
let nekintamuSuma = 0;
let kintamuSuma = 0;
let nebutinuSuma = 0;
let forma = document.forms[0];
let listas = document.getElementById("income");

//Clock code
function showTime() {
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  var s = date.getSeconds(); // 0 - 59
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;
  var time = h + ":" + m + ":" + s;
  document.getElementById("clock").innerText = time;
  document.getElementById("clock").textContent = time;
  setTimeout(showTime, 1000);
}
showTime();


//Add money to array
// Add to list of items entered
let value = (e) => {
  e.preventDefault();
  value = e.target.number.value;
  nameValue = e.target.text.value;
  let type = document.forms.forma.elements.inlineRadioOptions.value;
  let li = document.createElement('li');
  li.className = "list-group-item list-group-item-success";
  li.textContent = nameValue + " : " + value + " €";

  if (value > 0) {
    if (type == 1) {
      pajamos.push(value);
      pajamuSuma += Number(value);
      listas.appendChild(li);
      li.className = "list-group-item list-group-item-success";
    } else if (type == 2) {
      nekintamos.push(value);
      nekintamuSuma += Number(value);
      listas.appendChild(li);
      li.className = "list-group-item list-group-item-danger";
    } else if (type == 3) {
      kintamos.push(value);
      kintamuSuma += Number(value);
      listas.appendChild(li);
      li.className = "list-group-item list-group-item-danger";
    } else if (type == 4) {
      nebutinos.push(value);
      nebutinuSuma += Number(value);
      listas.appendChild(li);
      li.className = "list-group-item list-group-item-danger";
    } else {
      swal("Please select type", {
        button: false,
      });
    }
  } else {
    swal("Please enter valid number", "Positive decimal number above 0", "warning");
  }
};




// Fields reset
function resetForma() {
  forma.reset();
}
// getting radio button value
//  document.forms.forma.elements.inlineRadioOptions.value
function createChart() {
  chart.data[0].suma = nekintamuSuma;
  chart.data[1].suma = kintamuSuma;
  chart.data[2].suma = pajamuSuma;
  chart.data[3].suma = nebutinuSuma;
  //draw chart
  drawing();
}


// Create chart instance
var chart = am4core.create("chartdiv", am4charts.PieChart);
// Add object array with values
chart.data = [
  {
    tipai: "Fixed costs",
    suma: nekintamuSuma
  },
  {
    tipai: "Variable costs",
    suma: kintamuSuma
  },
  {
    tipai: "Income",
    suma: pajamuSuma
  },
  {
    tipai: "Unnecessary costs",
    suma: nebutinuSuma
  }
];



///* https://api.adviceslip.com/*/
// Advice api fetch converting to string

async function fetchAdvice() {
  response = await fetch('https://api.adviceslip.com/advice').then(resp => resp.json());
  response = response.slip.advice;
  changeText();
}
function changeText() {
  tekstas.innerHTML = response;

}
// Chart
// Add and configure Series
//Chart creation from amCharts library
function drawing() {
  var pieSeries = chart.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = "suma";
  pieSeries.dataFields.category = "tipai";
  pieSeries.labels.template.disabled = true;
  pieSeries.ticks.template.disabled = true;
  chart.legend = new am4charts.Legend();
  chart.responsive.enabled = true;
  chart.background.fill = am4core.color("#A8B1E3");

  chart.responsive.rules.push({
    relevant: function (target) {
      if (target.pixelWidth <= 400) {

        return true;
      }

      return false;
    },
    state: function (target, stateId) {
      if (target instanceof am4charts.Chart) {

        var state = target.states.create(stateId);
        state.properties.dy = -15;
        state.properties.paddingTop = 3;
        state.properties.paddingRight = 5;
        state.properties.paddingBottom = 3;
        state.properties.paddingLeft = 5;

        // Create a separate state for background
        target.setStateOnChildren = true;
        target.background.fill = am4core.color("#A8B1E3");
        var bgstate = target.background.states.create(stateId);
        bgstate.properties.fill = am4core.color("#A8B1E3");
        bgstate.properties.fillOpacity = 1;

        return state;
      }
      return;
    }
  });
  //Chart chaging legend
  chart.responsive.rules.push({
    relevant: function (target) {
      if (target.pixelWidth > target.pixelHeight) {

        return true;
      }

      return false;
    },
    state: function (target, stateId) {
      if (target instanceof am4charts.Legend) {

        var state = target.states.create(stateId);
        state.properties.position = "right";
        return state;
      }
      return null;
    }
  });
}


// Envent listeners

forma.addEventListener("submit", value);
forma.addEventListener("submit", resetForma);