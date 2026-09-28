//------*-*---*--*-----*--*-------------
function getemployes() {
  let firstreq = fetch("/api/chart/task")
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      //---------------employees
      var em = res.map((employee) => employee.name);
      // Works with any number of employees.
      let tottaskC = res.map((employee) => employee.tasks.length);
      let mychart = document.getElementById("myChart").getContext("2d");
      let barChart = new Chart(myChart, {
        type: "bar",
        data: {
          labels: em,
          datasets: [
            {
              label: ["Tasks"],
              data: tottaskC,
              backgroundColor: [
                "rgba(0, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
      });
    });
}

getemployes();
