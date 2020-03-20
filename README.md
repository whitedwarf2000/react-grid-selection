# Localize Direct Technical questions

## 1.

Our app’s main interface is a grid similar to Excel or Google Sheets.

- The grid should be able to handle up to 1000 columns
- The grid can have up to 1 000 000 rows
- Users can move around the grid in a similar way you can in Excel
 
**Using ReactJS, how would you implement the grid / which component would you choose? Why?**

### Answer
If the application were be built from scratch, I would like to implement follow these step below here:

- We can not show long lists of data directly on the DOM because it will be crashed (or bad performance). So I apply technique known as "windowing".
This technique only renders a small subset of my rows at any given time, and can dramatically reduce the time it takes
to re-render the components as well as the number of DOM nodes created. In order to save time, I used [react-virtualized](https://bvaughn.github.io/react-virtualized/#/components/List)
library for displaying lists, grids, and tabular data

- When the UI for grids has been done, we continue implement the method to help users can move around the grid by checked keyDown event
: if move up or move down, we will calculate based on rowIndex position; and if move left or move right, we will calculate based
on columnIndex. Fortunately, [react-virtualized](https://bvaughn.github.io/react-virtualized/#/components/ArrowKeyStepper)
has ArrowKeyStepper component help me to do that

So if you want to use the library already have full features like Excel or google sheet, depending on your purpose, I will
give some recommends as:

- For enterprise, we have [ag-grid](https://www.ag-grid.com/), it's works with major JavaScript Frameworks like React, Vue, Angular.
You can use common features provided by ag-grid to build your application, it also has open source on [github](https://github.com/ag-grid/ag-grid)
and extra money for enterprise features if you want to customize in development mode

- Another enterprise, we have [syncfusion](https://ej2.syncfusion.com/home/), it's a modern JavaScript UI controls library
that has been built from the ground up to be lightweight, responsive, modular and touch friendly. It also complete support for
Angular, React, Vue, ASP.NET MVC and ASP.NET Core frameworks. The most important, it is fully pay to use, expensive than ag-grid and
trusted by the world's leading companies like IBM, intel, BOSCH, VISA etc

- For free and open source, we have [react-data-grid](https://adazzle.github.io/react-data-grid/), excel-like grid component
built with React, with editors, keyboard navigation, copy & paste. This library used by more than 2k users and more than
3k star on [github](https://github.com/adazzle/react-data-grid). It also still maintained by 100 contributors

- And another free, we have [react-datasheet](https://nadbm.github.io/react-datasheet/), excel-like data grid (table) component
for React. It's simple and highly customizable excel-like spreadsheet. This library has 4k star on [github](https://github.com/nadbm/react-datasheet)
and still maintained

## 2.

One feature in the grid is multi-cell selection by dragging the mouse. When the user scrolls up/down/left/right of the grid, the selection should remain the same.

**Could you implement a React component for this feature, base on the selected method of making the grid in question 1?**

### Answer

Based on **react-virtualize** library, I had implemented the simple feature help user to selection by dragging the mouse
similar way do in Excel.

Live demo via: https://whitedwarf2000.github.io/

If you want to run on your local machine:

 - Clone this repo `https://github.com/whitedwarf2000/react-grid-selection.git`
and then
```shell
$ npm install
$ npm start       #visit http://localhost:3000
```
---
