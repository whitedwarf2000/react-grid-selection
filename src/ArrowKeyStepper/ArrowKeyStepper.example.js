import * as React from "react";
import clsx from "clsx";

import {
  ContentBox,
  ContentBoxHeader,
  ContentBoxParagraph
} from "../demo/ContentBox";
import ArrowKeyStepper from "./";
import AutoSizer from "../AutoSizer";
import Grid from "../Grid";
import styles from "./ArrowKeyStepper.module.css";

export default class ArrowKeyStepperExample extends React.PureComponent {
  state = {
    mode: "cells",
    isMouseDown: false,
    isClickable: true,
    scrollToColumn: 0,
    scrollToRow: 0,
    startCellIndex: 0,
    startRowIndex: 0,
    selectedItems: []
  };

  selectTo = (event, rowIndex, columnIndex) => {
    let rowStart = null;
    let rowEnd = null;
    let cellStart = null;
    let cellEnd = null;

    if (rowIndex < this.state.startRowIndex) {
      rowStart = rowIndex;
      rowEnd = this.state.startRowIndex;
    } else {
      rowStart = this.state.startRowIndex;
      rowEnd = rowIndex;
    }

    if (columnIndex < this.state.startCellIndex) {
      cellStart = columnIndex;
      cellEnd = this.state.startCellIndex;
    } else {
      cellStart = this.state.startCellIndex;
      cellEnd = columnIndex;
    }

    let result = [];

    for (let i = rowStart; i <= rowEnd; i += 1) {
      for (let j = cellStart; j <= cellEnd; j += 1) {
        result.push({
          r: i,
          c: j
        });
      }
    }
    this.setState({
      selectedItems: result
    });
  };

  handleMouseUp = () => {
    this.setState({
      isMouseDown: false
    });
  };

  mouseDown = (event, rowIndex, columnIndex) => {
    if (event.button === 0) {
      this.setState({
        isMouseDown: true,
        startCellIndex: columnIndex,
        startRowIndex: rowIndex,
        selectedItems: []
      });
    }

    return false;
  };

  mouseOver = (event, rowIndex, columnIndex) => {
    if (!this.state.isMouseDown) return;
    this.selectTo(event.target, rowIndex, columnIndex);
  };

  render() {
    const { mode, isClickable, scrollToColumn, scrollToRow } = this.state;

    return (
      <ContentBox>
        <ContentBoxHeader
          text="This demo using ArrowKeyStepper"
          sourceLink="https://bvaughn.github.io/react-virtualized/#/components/ArrowKeyStepper"
        />

        <ArrowKeyStepper
          onMouseUp={this.handleMouseUp}
          columnCount={100}
          isControlled={isClickable}
          onScrollToChange={isClickable ? this._selectCell : undefined}
          mode={mode}
          rowCount={1000}
          scrollToColumn={scrollToColumn}
          scrollToRow={scrollToRow}
        >
          {({ onSectionRendered, scrollToColumn, scrollToRow }) => (
            <div>
              <ContentBoxParagraph>
                {`Most-recently-stepped column: ${scrollToColumn}, row: ${scrollToRow}`}
              </ContentBoxParagraph>

              <AutoSizer disableHeight>
                {({ width }) => (
                  <Grid
                    className={styles.Grid}
                    columnWidth={this._getColumnWidth}
                    columnCount={100}
                    height={500}
                    onSectionRendered={onSectionRendered}
                    cellRenderer={({ columnIndex, key, rowIndex, style }) =>
                      this._cellRenderer({
                        columnIndex,
                        key,
                        rowIndex,
                        scrollToColumn,
                        scrollToRow,
                        style
                      })
                    }
                    rowHeight={this._getRowHeight}
                    rowCount={100}
                    scrollToColumn={scrollToColumn}
                    scrollToRow={scrollToRow}
                    width={width}
                  />
                )}
              </AutoSizer>
            </div>
          )}
        </ArrowKeyStepper>
      </ContentBox>
    );
  }

  _getColumnWidth = ({ index }) => {
    return (1 + (index % 3)) * 60;
  };

  _getRowHeight = ({ index }) => {
    return (1 + (index % 3)) * 30;
  };

  detectSelectedCell = (rowIndex, columnIndex) => {
    const { selectedItems } = this.state;
    return selectedItems.length <=1 ? false : selectedItems.some(item => {
      return item.r === rowIndex && item.c === columnIndex;
    });
  };

  _cellRenderer = ({
    columnIndex,
    key,
    rowIndex,
    scrollToColumn,
    scrollToRow,
    style
  }) => {
    const className = clsx(styles.Cell, {
      [styles.FocusedCell]:
        columnIndex === scrollToColumn && rowIndex === scrollToRow,
      [styles.selected]: this.detectSelectedCell(rowIndex, columnIndex)
    });

    return (
      <span
        role="none"
        onMouseDown={e => this.mouseDown(e, rowIndex, columnIndex)}
        onMouseOver={e => this.mouseOver(e, rowIndex, columnIndex)}
        className={className}
        key={key}
        onClick={
          this.state.isClickable &&
          (() =>
            this._selectCell({
              scrollToColumn: columnIndex,
              scrollToRow: rowIndex
            }))
        }
        style={style}
      >
        {`r:${rowIndex}, c:${columnIndex}`}
      </span>
    );
  };

  _selectCell = ({ scrollToColumn, scrollToRow }) => {
    this.setState({ scrollToColumn, scrollToRow });
  };
}
