$.fn.startGame = function (option) {
    option = $.extend({
        row: 4,
        column: 4,
        boxBackground: '#BBADA0',
        blockSize: 100,
        blockSpace: 15,
        blockBackground: '#CBC0B2',
        blocks: [
            {
                id: 0,
                value: 2,
                style: {"background-color": "rgb(238,228,218)", "color": "rgb(124,115,106)", "font-size": 58}
            },
            {
                id: 1,
                value: 4,
                style: {"background-color": "rgb(236,224,200)", "color": "rgb(124,115,106)", "font-size": 58}
            },
            {
                id: 2,
                value: 8,
                style: {"background-color": "rgb(242,177,121)", "color": "rgb(255,247,235)", "font-size": 58}
            },
            {
                id: 3,
                value: 16,
                style: {"background-color": "rgb(245,149,99)", "color": "rgb(255,250,235)", "font-size": 50}
            },
            {
                id: 4,
                value: 32,
                style: {"background-color": "rgb(244,123,94)", "color": "rgb(255,247,235)", "font-size": 50}
            },
            {
                id: 5,
                value: 64,
                style: {"background-color": "rgb(247,93,59)", "color": "rgb(255,247,235)", "font-size": 50}
            },
            {
                id: 6,
                value: 128,
                style: {"background-color": "rgb(236,205,112)", "color": "rgb(255,247,235)", "font-size": 42}
            },
            {
                id: 7,
                value: 256,
                style: {"background-color": "rgb(237,204,97)", "color": "rgb(255,247,235)", "font-size": 42}
            },
            {
                id: 8,
                value: 512,
                style: {"background-color": "rgb(236,200,80)", "color": "rgb(255,247,235)", "font-size": 42}
            },
            {
                id: 9,
                value: 1024,
                style: {"background-color": "rgb(237,197,63)", "color": "rgb(255,247,235)", "font-size": 34}
            },
            {
                id: 10,
                value: 2048,
                style: {"background-color": "rgb(238,194,46)", "color": "rgb(255,247,235)", "font-size": 34}
            },
            {
                id: 11,
                value: 4096,
                style: {"background-color": "rgb(61,58,51)", "color": "rgb(255,247,235)", "font-size": 34}
            }
        ]
    }, option);
    var $this = $(this);
    var gameData = [];

    function getPosition(x, y) {
        return {
            top: (option.blockSize + option.blockSpace) * y + option.blockSpace,
            left: (option.blockSize + option.blockSpace) * x + option.blockSpace
        }
    }

    // 创建游戏界面
    function init() {
        $this.css({
            width: option.column * option.blockSize + (option.column + 1) * option.blockSpace,
            height: option.row * option.blockSize + (option.row + 1) * option.blockSpace,
            background: option.boxBackground,
            borderRadius: option.blockSpace,
            position: 'relative'
        });

        for (var y = 0; y < option.row; y++) {
            gameData[y] = [];
            for (var x = 0; x < option.column; x++) {
                gameData[y][x] = 0;
                var $div = $('<div></div>');
                var blockPosition = getPosition(x, y);
                $div.css({
                    width: option.blockSize,
                    height: option.blockSize,
                    background: option.blockBackground,
                    position: 'absolute',
                    top: blockPosition.top,
                    left: blockPosition.left
                });
                $this.append($div);
            }
        }
    }

    function createBlock(id, x, y) {
        var emptyBlock = [];
        for(var i = 0; i < gameData.length; i++) {
            for(var j = 0; j < gameData[i].length; j++) {
                if(gameData[i][j] === 0) {
                    emptyBlock.push({
                        x: j,
                        y: i
                    })
                }
            }
        }
        var randomIndex = {};
        if (x === undefined || y === undefined) {
            randomIndex = emptyBlock[Math.floor(Math.random() * emptyBlock.length)];
        } else {
            randomIndex.x = x;
            randomIndex.y = y;
            var flag = false;
            for (var k = 0; k < emptyBlock.length; k++) {
                if (randomIndex.x === emptyBlock[k].x && randomIndex.y === emptyBlock[k].y) {
                    flag = true;
                }
            }
            if (!flag) throw "指定位置重复，无法创建";

        }
        var randomBlockPosition = getPosition(randomIndex.x, randomIndex.y);
        var block = id === undefined ? Math.random() > 0.3 ? option.blocks[0] : option.blocks[1] : option.blocks[id];
        var $div = $('<div></div>');
        $div.css($.extend({
            width: 0,
            height: 0,
            textAlign: 'center',
            lineHeight: option.blockSize + 'px',
            position: 'absolute',
            top: randomBlockPosition.top + option.blockSize / 2,
            left: randomBlockPosition.left + option.blockSize / 2
        }, block.style));
        $this.append($div);
        $div.addClass(randomIndex.x + '-' + randomIndex.y);
        gameData[randomIndex.y][randomIndex.x] = block;
        $div.animate({
            width: option.blockSize,
            height: option.blockSize,
            top: randomBlockPosition.top,
            left: randomBlockPosition.left
        }, 300, function () {
            $div.html(block.value);
        });
    }

    function moveTop() {
        var moveIndex = 0;
        var count = false;
        for (var x = 0; x < gameData.length; x++) {
            moveIndex = 0;
            for (var y = 1; y < gameData[x].length; y++) {
                if (gameData[y][x] !== 0) {
                    // 获取到当前元素
                    var $block = $('.' + x + '-' + y);
                    // 目标对比点的坐标
                    var targetPoint = {x: x, y: moveIndex};
                    if (gameData[targetPoint.y][targetPoint.x] === 0) {
                        gameData[targetPoint.y][targetPoint.x] = gameData[y][x];
                        gameData[y][x] = 0;
                        count = true;
                        $block.animate({
                            top: getPosition(targetPoint.x, targetPoint.y).top,
                            left: getPosition(targetPoint.x, targetPoint.y).left
                        }, 200);
                        $block.removeClass();
                        $block.addClass(targetPoint.x + '-' + targetPoint.y);
                    } else {
                        if (gameData[targetPoint.y][targetPoint.x].value === gameData[y][x].value) {
                            var updateObj = option.blocks[gameData[y][x].id + 1];
                            var targetEle = $('.' + targetPoint.x + '-' + targetPoint.y);
                            gameData[targetPoint.y][targetPoint.x] = updateObj;
                            gameData[y][x] = 0;
                            count = true;
                            $block.animate({
                                top: getPosition(targetPoint.x, targetPoint.y).top,
                                left: getPosition(targetPoint.x, targetPoint.y).left
                            }, 200, function ($block, targetEle, updateObj) {
                                return function () {
                                    $block.remove();
                                    targetEle.css(updateObj.style);
                                    targetEle.html(updateObj.value);
                                }
                            }($block, targetEle, updateObj));
                            moveIndex++;
                        } else {
                            targetPoint.y = ++moveIndex;
                            if (targetPoint.y < y) {
                                gameData[targetPoint.y][targetPoint.x] = gameData[y][x];
                                gameData[y][x] = 0;
                                $block.removeClass();
                                $block.addClass(targetPoint.x + '-' + targetPoint.y);
                                count = true;
                                $block.animate({
                                    top: getPosition(targetPoint.x, targetPoint.y).top,
                                    left: getPosition(targetPoint.x, targetPoint.y).left
                                }, 200);
                            }
                        }
                    }
                }
            }
        }
        if(count){
            createBlock();
        }
    }

    function moveBottom() {
        var moveIndex = option.row - 1;
        var count = false;
        for (var x = 0; x < gameData.length; x++) {
            moveIndex = option.row - 1;
            for (var y = gameData[x].length-2; y>=0; y--) {
                if (gameData[y][x] !== 0) {
                    // 获取到当前元素
                    var $block = $('.' + x + '-' + y);
                    // 目标对比点的坐标
                    var targetPoint = {x: x, y: moveIndex};
                    if (gameData[targetPoint.y][targetPoint.x] === 0) {
                        gameData[targetPoint.y][targetPoint.x] = gameData[y][x];
                        gameData[y][x] = 0;
                        count = true;
                        $block.animate({
                            top: getPosition(targetPoint.x, targetPoint.y).top,
                            left: getPosition(targetPoint.x, targetPoint.y).left
                        }, 200);
                        $block.removeClass();
                        $block.addClass(targetPoint.x + '-' + targetPoint.y);
                    } else {
                        if (gameData[targetPoint.y][targetPoint.x].value === gameData[y][x].value) {
                            var updateObj = option.blocks[gameData[y][x].id + 1];
                            var targetEle = $('.' + targetPoint.x + '-' + targetPoint.y);
                            gameData[targetPoint.y][targetPoint.x] = updateObj;
                            gameData[y][x] = 0;
                            count = true;
                            $block.animate({
                                top: getPosition(targetPoint.x, targetPoint.y).top,
                                left: getPosition(targetPoint.x, targetPoint.y).left
                            }, 200, function ($block, targetEle, updateObj) {
                                return function () {
                                    $block.remove();
                                    targetEle.css(updateObj.style);
                                    targetEle.html(updateObj.value);
                                }
                            }($block, targetEle, updateObj));
                            moveIndex--;
                        } else {
                            targetPoint.y = --moveIndex;
                            if (targetPoint.y !== y) {
                                gameData[targetPoint.y][targetPoint.x] = gameData[y][x];
                                gameData[y][x] = 0;
                                $block.removeClass();
                                $block.addClass(targetPoint.x + '-' + targetPoint.y);
                                count = true;
                                $block.animate({
                                    top: getPosition(targetPoint.x, targetPoint.y).top,
                                    left: getPosition(targetPoint.x, targetPoint.y).left
                                }, 200);
                            }
                        }
                    }
                }
            }
        }
        if(count){
            createBlock();
        }
    }

    function moveRight() {
        var moveIndex = option.column - 1;
        var count = false;
        console.log(moveIndex);
        for (var y = 0; y < gameData.length; y++) {
            moveIndex = option.column - 1;
            for (var x = gameData[y].length-2; x>=0; x--) {
                if (gameData[y][x] !== 0) {
                    // 获取到当前元素
                    var $block = $('.' + x + '-' + y);
                    // 目标对比点的坐标
                    var targetPoint = {x: moveIndex, y: y};
                    if (gameData[targetPoint.y][targetPoint.x] === 0) {
                        gameData[targetPoint.y][targetPoint.x] = gameData[y][x];
                        gameData[y][x] = 0;
                        count = true;
                        $block.animate({
                            top: getPosition(targetPoint.x, targetPoint.y).top,
                            left: getPosition(targetPoint.x, targetPoint.y).left
                        }, 200);
                        $block.removeClass();
                        $block.addClass(targetPoint.x + '-' + targetPoint.y);
                    } else {
                        if (gameData[targetPoint.y][targetPoint.x].value === gameData[y][x].value) {
                            var updateObj = option.blocks[gameData[y][x].id + 1];
                            var targetEle = $('.' + targetPoint.x + '-' + targetPoint.y);
                            gameData[targetPoint.y][targetPoint.x] = updateObj;
                            gameData[y][x] = 0;
                            count = true;
                            $block.animate({
                                top: getPosition(targetPoint.x, targetPoint.y).top,
                                left: getPosition(targetPoint.x, targetPoint.y).left
                            }, 200, function ($block, targetEle, updateObj) {
                                return function () {
                                    $block.remove();
                                    targetEle.css(updateObj.style);
                                    targetEle.html(updateObj.value);
                                }
                            }($block, targetEle, updateObj));
                            moveIndex--;
                        } else {
                            targetPoint.x = --moveIndex;
                            if (targetPoint.x !== x) {
                                gameData[targetPoint.y][targetPoint.x] = gameData[y][x];
                                gameData[y][x] = 0;
                                $block.removeClass();
                                $block.addClass(targetPoint.x + '-' + targetPoint.y);
                                count = true;
                                $block.animate({
                                    top: getPosition(targetPoint.x, targetPoint.y).top,
                                    left: getPosition(targetPoint.x, targetPoint.y).left
                                }, 200);
                            }
                        }
                    }
                }
            }
        }
        if(count){
            createBlock();
        }
    }

    function moveLeft() {
        var moveIndex = 0;
        var count = false;
        console.log(moveIndex);
        for (var y = 0; y < gameData.length; y++) {
            moveIndex = 0;
            for (var x = 1; x<gameData[y].length; x++) {
                if (gameData[y][x] !== 0) {
                    // 获取到当前元素
                    var $block = $('.' + x + '-' + y);
                    // 目标对比点的坐标
                    var targetPoint = {x: moveIndex, y: y};
                    if (gameData[targetPoint.y][targetPoint.x] === 0) {
                        gameData[targetPoint.y][targetPoint.x] = gameData[y][x];
                        gameData[y][x] = 0;
                        count = true;
                        $block.animate({
                            top: getPosition(targetPoint.x, targetPoint.y).top,
                            left: getPosition(targetPoint.x, targetPoint.y).left
                        }, 200);
                        $block.removeClass();
                        $block.addClass(targetPoint.x + '-' + targetPoint.y);
                    } else {
                        if (gameData[targetPoint.y][targetPoint.x].value === gameData[y][x].value) {
                            var updateObj = option.blocks[gameData[y][x].id + 1];
                            var targetEle = $('.' + targetPoint.x + '-' + targetPoint.y);
                            gameData[targetPoint.y][targetPoint.x] = updateObj;
                            gameData[y][x] = 0;
                            count = true;
                            $block.animate({
                                top: getPosition(targetPoint.x, targetPoint.y).top,
                                left: getPosition(targetPoint.x, targetPoint.y).left
                            }, 200, function ($block, targetEle, updateObj) {
                                return function () {
                                    $block.remove();
                                    targetEle.css(updateObj.style);
                                    targetEle.html(updateObj.value);
                                }
                            }($block, targetEle, updateObj));
                            moveIndex++;
                        } else {
                            targetPoint.x = ++moveIndex;
                            if (targetPoint.x !== x) {
                                gameData[targetPoint.y][targetPoint.x] = gameData[y][x];
                                gameData[y][x] = 0;
                                $block.removeClass();
                                $block.addClass(targetPoint.x + '-' + targetPoint.y);
                                count = true;
                                $block.animate({
                                    top: getPosition(targetPoint.x, targetPoint.y).top,
                                    left: getPosition(targetPoint.x, targetPoint.y).left
                                }, 200);
                            }
                        }
                    }
                }
            }
        }
        if(count){
            createBlock();
        }else{
            alert('此方向无法移动');
        }
    }

    init();
    createBlock();
    createBlock();
    $(document).on('keydown',function (e) {
        console.log(e.keyCode);
        switch(e.keyCode){
            case 37:
                moveLeft();
                break;
            case 38:
                moveTop();
                break;
            case 39:
                moveRight();
                break;
            case 40:
                moveBottom();
                break;
        }
    })

};
