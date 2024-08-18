new Vue({
  el: '#app',
  data: {
      colorNames: ['红', '黄', '青', '绿', '咖', '蓝', '紫', '粉', '橙', '玫'],
      sizes: [
          {type: '大', weight: 1},
          {type: '中', weight: 7},
          {type: '小', weight: 2}
      ],
      drawnTurtles: [],
      currentTurtle: [],
      grid: Array(3).fill(null).map(() => Array(3).fill(null)), // 初始化九宫格
      drawCount: 8,  // 默认一次抽取8只乌龟
      restCount: 8,
      wishColor: '红',  // 设定一个许愿颜色
      whishAward: 1, //许愿色奖励
      doubleAward: 1, // 两个相同乌龟奖励
      tripleAward: 3, // 连线乌龟奖励
      clearAward: 5 // 清台奖励
  },
  methods: {
      // 一次性抽取多个乌龟
      drawTurtles() {
          this.restCount = this.drawCount;
          this.currentTurtle = [];  // 清空当前显示的乌龟

          while (this.restCount > 0) {
              const randomColor = this.colorNames[Math.floor(Math.random() * this.colorNames.length)];
              const randomSize = this.getRandomSize();

              const turtle = {
                  color: randomColor,
                  size: randomSize
              };

              // 放置到九宫格中
              this.placeTurtleInGrid(turtle);

              // 检查并处理奖励条件
              this.checkRewards(turtle);

              this.currentTurtle.push(turtle);
              this.drawnTurtles.push(turtle);
              this.restCount--;
          }
      },
      // 根据权重随机选择乌龟大小
      getRandomSize() {
          const totalWeight = this.sizes.reduce((total, size) => total + size.weight, 0);
          const random = Math.random() * totalWeight;
          let cumulativeWeight = 0;

          for (const size of this.sizes) {
              cumulativeWeight += size.weight;
              if (random < cumulativeWeight) {
                  return size.type;
              }
          }
      },
      // 将乌龟放入九宫格
      placeTurtleInGrid(turtle) {
          for (let row = 0; row < 3; row++) {
              for (let col = 0; col < 3; col++) {
                  if (!this.grid[row][col]) {
                      this.grid[row][col] = turtle;
                      return;
                  }
              }
          }
      },
      // 检查奖励条件
      checkRewards(turtle) {
          // 许愿颜色奖励
          if (turtle.color === this.wishColor) {
              this.restCount += this.whishAward;
          }

          // 检查是否有相同颜色的乌龟并移除
          const sameColorPositions = this.findSameColorTurtles(turtle.color);
          if (sameColorPositions.length >= 2) {
              this.removeTurtles(sameColorPositions);
              this.restCount += this.doubleAward;
          }

          // 检查是否有连线
          if (this.checkLine(turtle.color)) {
              this.restCount += this.tripleAward;
          }

          // 检查九宫格是否清空
          if (this.isGridEmpty()) {
              this.restCount += this.clearAward;
          }
      },
      // 查找相同颜色的乌龟
      findSameColorTurtles(color) {
          const positions = [];
          for (let row = 0; row < 3; row++) {
              for (let col = 0; col < 3; col++) {
                  if (this.grid[row][col] && this.grid[row][col].color === color) {
                      positions.push({ row, col });
                  }
              }
          }
          return positions;
      },
      // 移除指定位置的乌龟
      removeTurtles(positions) {
          positions.forEach(pos => {
              this.grid[pos.row][pos.col] = null;
          });
      },
      // 检查是否有连线
      checkLine(color) {
          // 检查行、列和对角线
          for (let i = 0; i < 3; i++) {
              if (this.grid[i][0] && this.grid[i][1] && this.grid[i][2] &&
                  this.grid[i][0].color === color &&
                  this.grid[i][1].color === color &&
                  this.grid[i][2].color === color) {
                  this.removeTurtles([{ row: i, col: 0 }, { row: i, col: 1 }, { row: i, col: 2 }]);
                  return true;
              }
              if (this.grid[0][i] && this.grid[1][i] && this.grid[2][i] &&
                  this.grid[0][i].color === color &&
                  this.grid[1][i].color === color &&
                  this.grid[2][i].color === color) {
                  this.removeTurtles([{ row: 0, col: i }, { row: 1, col: i }, { row: 2, col: i }]);
                  return true;
              }
          }
          if (this.grid[0][0] && this.grid[1][1] && this.grid[2][2] &&
              this.grid[0][0].color === color &&
              this.grid[1][1].color === color &&
              this.grid[2][2].color === color) {
              this.removeTurtles([{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }]);
              return true;
          }
          if (this.grid[0][2] && this.grid[1][1] && this.grid[2][0] &&
              this.grid[0][2].color === color &&
              this.grid[1][1].color === color &&
              this.grid[2][0].color === color) {
              this.removeTurtles([{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }]);
              return true;
          }
          return false;
      },
      // 检查九宫格是否清空
      isGridEmpty() {
          return this.grid.every(row => row.every(cell => cell === null));
      },
      clearTurtleList() {
        this.drawnTurtles = [];
      }
  }
});
