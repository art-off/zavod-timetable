<script>
export default {
  data() {
    return {
      countOfMachine: "",
      countOfDetails: "",
      items: (() => {
        let arr = [];
        for (let i = 0; i < 100; i++) {
          arr.push(Array());
          for (let j = 0; j < 100; j++) {
            arr[i].push(1);
          }
        }
        return arr;
      })(),
      fetchedData: null,
      chartStart: "2021-07-01 06:00",
      chartEnd: "2021-07-01 10:00",
      chartEnd_date: new Date("2021-07-01T10:00"),
    };
  },
  methods: {
    stringToColour: function (str) {
      var str = str + "lllllsss";
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      var colour = "#";
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xff;
        colour += ("00" + value.toString(16)).substr(-2);
      }
      return colour;
    },
    getRowItems: function (data, result) {
      const START_DATE = new Date("2021-07-01T06:00");

      const formatDayOrMont = (day) => {
        let newDay = day.toString();
        if (newDay.length === 1) newDay = "0" + newDay;
        return newDay;
      };

      const formatDate = (date) => {
        return (
          date.getFullYear() +
          "-" +
          formatDayOrMont(date.getMonth() + 1) +
          "-" +
          formatDayOrMont(date.getDate()) +
          " " +
          formatDayOrMont(date.getHours()) +
          ":00"
        );
      };

      const createRowItem = (label, start, end) => {
        const startDate = START_DATE.addDays(start);
        const endDate = START_DATE.addDays(end);

        if (endDate.getTime() > this.chartEnd_date.getTime()) {
          this.chartEnd_date = endDate;
          this.chartEnd = formatDate(this.chartEnd_date);
          console.log(endDate);
        }
        return {
          myBeginDate: formatDate(startDate),
          myEndDate: formatDate(endDate),
          ganttBarConfig: {
            id: formatDate(startDate) + formatDate(endDate) + label,
            label: "",
            immobile: true,
            style: {
              background: this.stringToColour(label),
            },
          },
        };
      };

      let resultRows = [];

      for (let i = 0; i < result.length; i++) {
        let currStart = data[i][0];
        let currEnd = currStart + data[i][1];
        // this.chartEnd = START_DATE.addDays(currEnd);
        resultRows.push(createRowItem(result[i], currStart, currEnd));
      }

      console.log(resultRows);

      return resultRows;
    },
    fetchPetrovDecision: function () {
      let resultArr = this.items.slice(0, Number(this.countOfMachine));
      for (let i = 0; i < resultArr.length; i++) {
        resultArr[i] = resultArr[i].slice(0, Number(this.countOfDetails));
        for (let j = 0; j < resultArr[i].length; j++) {
          resultArr[i][j] = Number(resultArr[i][j]);
        }
      }

      this.axios
        .post("https://nokova-api.herokuapp.com/petrov", resultArr)
        .then((response) => {
          this.fetchedData = response.data;
          console.log(this.fetchedData);
        });
    },
    fetchDjonsonDecision: function () {
      let resultArr = this.items.slice(0, Number(this.countOfMachine));
      for (let i = 0; i < resultArr.length; i++) {
        resultArr[i] = resultArr[i].slice(0, Number(this.countOfDetails));
        for (let j = 0; j < resultArr[i].length; j++) {
          resultArr[i][j] = Number(resultArr[i][j]);
        }
      }

      this.axios
        .post("https://nokova-api.herokuapp.com/dzonsan", resultArr)
        .then((response) => {
          this.fetchedData = response.data;
          console.log(this.fetchedData);
        });
    },
  },
};
</script>

<template>
  <div style="display: flex; flex-direction: row; align-items: start">
    <input
      placeholder="Кол-во машин"
      v-model="countOfMachine"
      style="margin-right: 10px"
    />
    <input
      placeholder="Кол-во деталей"
      v-model="countOfDetails"
      style="margin-right: 30px"
    />

    <div v-for="i in Number(countOfDetails)">
      <div v-for="j in Number(countOfMachine)">
        <input v-model="items[j - 1][i - 1]" size="3" />
      </div>
    </div>
  </div>
  <button v-on:click="fetchPetrovDecision">Расчитать по Петрову</button>
  <button v-on:click="fetchDjonsonDecision">Расчитать по Джонсону</button>

  <g-gantt-chart
    :chart-start="chartStart"
    :chart-end="chartEnd"
    precision="hour"
    bar-start="myBeginDate"
    bar-end="myEndDate"
  >
    <div
      v-if="fetchedData !== null"
      v-for="item in fetchedData.matrix_with_line"
    >
      <g-gantt-row
        :label="fetchedData.matrix_with_line.indexOf(item) + 1"
        :bars="getRowItems(item, fetchedData.result)"
      />
    </div>
  </g-gantt-chart>

  <div v-if="fetchedData !== null" v-for="res in fetchedData.result">
    <div style="display: flex; flex-direction: row; align-items: center">
      <div :style="coloredDivStyle(res)"></div>
      <p>- {{ res }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

function coloredDivStyle(res) {
  const stringToColour = function (str) {
    var str = str + "lllllsss";
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = "#";
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff;
      colour += ("00" + value.toString(16)).substr(-2);
    }
    return colour;
  };
  return {
    width: "10px",
    height: "10px",
    background: stringToColour(res),
  };
}

// const START_DATE = new Date("2021-07-01T00:00");

// const stringToColour = function (str) {
//   var str = str + "lllllsss";
//   var hash = 0;
//   for (var i = 0; i < str.length; i++) {
//     hash = str.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   var colour = "#";
//   for (var i = 0; i < 3; i++) {
//     var value = (hash >> (i * 8)) & 0xff;
//     colour += ("00" + value.toString(16)).substr(-2);
//   }
//   return colour;
// };

// const formatDayOrMont = (day) => {
//   let newDay = day.toString();
//   if (newDay.length === 1) newDay = "0" + newDay;
//   return newDay;
// };

// const formatDate = (date) => {
//   return (
//     date.getFullYear() +
//     "-" +
//     formatDayOrMont(date.getMonth() + 1) +
//     "-" +
//     formatDayOrMont(date.getDate()) +
//     " 00:00"
//   );
// };

// const createRowItem = (label, start, end) => {
//   const startDate = START_DATE.addDays(start);
//   const endDate = START_DATE.addDays(end);
//   return {
//     myBeginDate: formatDate(startDate),
//     myEndDate: formatDate(endDate),
//     ganttBarConfig: {
//       id: "unique-id-1",
//       label: label,
//       immobile: true,
//       style: {
//         background: stringToColour(label),
//       },
//     },
//   };
// };

// const getRowItems = (data, result) => {
//   let resultRows = [];

//   for (let i = 0; i < result.length; i++) {
//     resultRows.push(
//       createRowItem(result[i], data[i][0], data[i][0] + data[i][1])
//     );
//   }

//   console.log(resultRows);

//   return resultRows;
// };

// const row1BarList = ref([
//   createRowItem("label12", 3, 5),
//   createRowItem("label12", 1, 2),
//   createRowItem("label1", 6, 9),
// ]);
// const row2BarList = ref([createRowItem("label1", 6, 9)]);
</script>