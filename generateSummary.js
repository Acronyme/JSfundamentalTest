   'use strict'
    function generateSummary(input) {
        var strArr = [];
        //开始、结束时间，总时长
        var fromTime, tillTime, totalTime;
        //总收入，总支出，收益
        var totalIncome = 0,
            totalPayment = 0,
            profit = 0;
        //工作日时段
        var workDayTimeFrame = [
            [9, 12],
            [12, 18],
            [18, 20],
            [20, 22]
        ];
        //周末时段
        var weekendTimeFrame = [
            [9, 12],
            [12, 18],
            [18, 22]
        ];

        //strArr中的每一个数组对应字符串对应行，每个数组内部各项对应时间、日期、人数;
        strArr = input.split('\n').map(item => item.trim().split(' '));

        //订场策略
        function siteNum(num) {
            var site = Math.floor(num / 6);
            var remainder = num % 6;
            //当不足六人时
            if (site === 0) {
                switch (remainder < 4) {
                    case true:
                        return 0;
                        break;
                    case false:
                        return 1;
                        break;
                }
                //当超过六人
                //若T=1，X任意值都定两个场
            } else if (site === 1) {
                return 2;
                //T为2或者3时，若余数大于4多加一个场。
            } else if (site === 2 || site === 3) {
                switch (remainder >= 4) {
                    case true:
                        return site + 1;
                        break;
                    case false:
                        return site;
                        break;
                }
                //若T大于3，余数不多定。  
            } else if (site > 3) {
                return site;
            } else {
                return false;
            }
        };

        //计算周几
        function whichDay(str) {
            var date = new Date(Date.parse(str));
            if (date) {
                return date.getDay();
            } else {
                return false;
            }
        }

        //计算时段
        function timeFrame(str) {
            fromTime = Number(str.slice(0, 2));
            tillTime = Number(str.slice(6, 8));
        }
        //收费策略
        function charge(arr) {
            var day = whichDay(arr[0]),
                time = arr[1],
                num = arr[2];
            //支出总额
            var disburse;
            //时间开始区段，结束区段，第一区段时长，后一区段时长,总场数
            var fromFrame, tillFrame, firstFrame, lastFrame, totalNum;
            timeFrame(time);
            totalNum = siteNum(num);
            //周一到周五
            if (day !== 0 && day !== 6) {
                workDayTimeFrame.forEach(function(item, index) {
                    //起始区段
                    if (item[0] <= fromTime && item[1] > fromTime) {
                        fromFrame = index;
                        firstFrame = item[1] - fromTime;
                    }
                    //终止区段
                    if (item[0] <= tillTime && item[1] >= tillTime) {
                        tillFrame = index;
                        lastFrame = tillTime - item[0];
                    } else {
                        return false;
                    }
                });
                //当在收费不变的一个时间区段完成活动
                if (fromFrame === tillFrame) {
                    firstFrame = tillTime - fromTime;
                    switch (fromFrame) {
                        case 0:
                            disburse = 30 * firstFrame;
                            break;
                        case 1:
                            disburse = 50 * firstFrame;
                            break;
                        case 2:
                            disburse = 80 * firstFrame;
                            break;
                        case 3:
                            disburse = 60 * firstFrame;
                            break;
                    }
                } else {
                    switch (fromFrame) {
                        case 0:
                            disburse = 30 * firstFrame + 50 * lastFrame;
                            break;
                        case 1:
                            disburse = 50 * firstFrame + 80 * lastFrame;
                            break;
                        case 2:
                            disburse = 80 * firstFrame + 60 * lastFrame;
                            break;
                    }
                }
                return disburse * totalNum;
                //周六及周日
            } else {
                weekendTimeFrame.forEach(function(item, index) {
                    //起始区段
                    if (item[0] <= fromTime && item[1] > fromTime) {
                        fromFrame = index;
                        firstFrame = item[1] - fromTime;
                    }
                    //终止区段
                    if (item[0] <= tillTime && item[1] >= tillTime) {
                        tillFrame = index;
                        lastFrame = tillTime - item[0];
                    } else {
                        return false;
                    }
                });
                //当在收费不变的一个时间区段完成活动
                if (fromFrame === tillFrame) {
                    firstFrame = tillTime - fromTime;
                    switch (fromFrame) {
                        case 0:
                            disburse = 40 * firstFrame;
                            break;
                        case 1:
                            disburse = 50 * firstFrame;
                            break;
                        case 2:
                            disburse = 60 * firstFrame;
                            break;
                    }
                } else {
                    switch (fromFrame) {
                        case 0:
                            disburse = 40 * firstFrame + 50 * lastFrame;
                            break;
                        case 1:
                            disburse = 50 * firstFrame + 60 * lastFrame;
                            break;
                    }
                }
                return disburse * totalNum;
            }
        }
        //收入
        function income(num) {
            if (num >= 4) {
                return num * 30;
            } else {
                return 0;
            }
        }

        strArr.forEach(function(item) {
            //每条活动记录的收入与支出
            var onceIncome = income(item[2]);
            var cost = charge(item);
            var surplus = onceIncome - cost;
            totalIncome += onceIncome;
            totalPayment += cost;
            profit += surplus;
            //删除人数,推入单次收入与支出
            item.splice(2, 1).push('+' + onceIncome,'-' + cost);
            if (surplus > 0) {
                item.push('+' + surplus);
            } else {
                item.push(surplus);
            }
        })
        var resultStr = strArr.map(item => item.join(' ')).join('\n');
        if (totalIncome && totalPayment && profit) {
            resultStr += '\n' + '\n' + 'Total Income: ' + totalIncome + '\n' + 'Total Payment: ' + totalPayment + '\n' + 'Profit: ' + profit;
            console.log(resultStr);
            alert(resultStr);
            return resultStr;
        } else {
            console.log('输入不规范');
            alert('输入不规范');
            return;
        }
    }

  let str=
        `2016-06-02 20:00~22:00 7 
         2016-06-03 09:00~12:00 14 
         2016-06-04 14:00~17:00 22 
         2016-06-05 19:00~22:00 3 
         2016-06-06 12:00~15:00 15 
         2016-06-07 15:00~17:00 12 
         2016-06-08 10:00~13:00 19 
         2016-06-09 16:00~18:00 16 
         2016-06-10 20:00~22:00 5 
         2016-06-11 13:00~15:00 11`
         
 generateSummary(str);
