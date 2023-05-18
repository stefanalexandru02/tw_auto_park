function drawLine(ctx, startX, startY, endX, endY, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();
  }
  
function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();
    ctx.restore();
  }
  
function drawPieSlice(
    ctx,
    centerX,
    centerY,
    radius,
    startAngle,
    endAngle,
    fillColor,
    strokeColor
  ) {
    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function compressArrayWithOther(
  array, 
  keepCount,
  labelName,
  countName
) {
  array.sort((a,b)=>{return b[countName] - a[countName]});
  let result = {};
  for(let i=0;i<keepCount;++i) {
    result[array[i][labelName]] = array[i][countName];
  }
  let otherCount = 0;
  for(let i = keepCount; i < array.length; ++i) {
    otherCount += array[i][countName];
  }
  result['Altele'] = otherCount;
  return result;
}