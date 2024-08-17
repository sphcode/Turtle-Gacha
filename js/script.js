new Vue({
  el: '#app',
  data: {
      colors: ['红', '黄', '青', '绿', '咖', '蓝', '紫', '粉', '橙', '玫'],
      sizes: [
          {type: '大', weight: 1},
          {type: '中', weight: 7},
          {type: '小', weight: 2}
      ],
      drawnTurtles: [],
      currentTurtle: [],
      drawCount: 8  // 默认一次抽取8只乌龟
  },
  methods: {
      // 一次性抽取多个乌龟
      drawTurtles() {
          this.currentTurtle = [];  // 清空当前显示的乌龟
          for (let i = 0; i < this.drawCount; i++) {
              const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
              const randomSize = this.getRandomSize();

              const turtle = {
                  color: randomColor,
                  size: randomSize
              };

              this.currentTurtle.push(turtle);
              this.drawnTurtles.push(turtle);
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
      }
  }
});
