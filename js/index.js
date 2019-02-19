/**
 * Created by 89426 on 2019/1/25.
 */
Zepto(function ($) {

    let loadingRender = (function () {
        let ary = ["img/icon.png","img/psb (1).jpg","img/psb (2).jpg","img/psb.jpg","img/zf_concatAddress.png","img/zf_concatInfo.png","img/zf_concatPhone.png","img/zf_course.png","img/zf_course1.png","img/zf_course2.png","img/zf_course3.png","img/zf_course4.png","img/zf_course5.png","img/zf_course6.png","img/zf_cube1.png","img/zf_cube2.png","img/zf_cube3.png","img/zf_cube4.png","img/zf_cube5.png","img/zf_cube6.png","img/zf_cubeBg.jpg","img/zf_cubeTip.png","img/zf_emploment.png","img/zf_messageArrow1.png","img/zf_messageArrow2.png","img/zf_messageChat.png","img/zf_messageKeyboard.png","img/zf_messageLogo.png","img/zf_messageStudent.png","img/zf_outline.png","img/zf_phoneBg.jpg","img/zf_phoneDetail.png","img/zf_phoneListen.png","img/zf_phoneLogo.png","img/zf_return.png","img/zf_styleTip1.png","img/zf_styleTip2.png","img/zf_teacher1.jpg","img/zf_teacher2.jpg","img/zf_teacher3.jpg","img/zf_teacher4.jpg","img/zf_teacher5.jpg","img/zf_teacher6.jpg","img/zf_teacherTip.png"],
            $current = $('.current'),
            $loadingBox=$('.loadingBox');
        let len = ary.length,
            n = 0;
        let run = function () {
            let curW = 4.6,
                num = 0.1;
            let t1 = setInterval(function () {
                let curr = num * curW;
                curr += 'rem';
                document.getElementsByClassName('current')[0].style.width = curr;
                if (num >= 0.99) {
                    document.getElementsByClassName('current')[0].style.width = curW + 'rem';
                    clearInterval(t1);
                    return;
                }
                num += 0.01;
            }, 20);
        };
        let runTrue = function (callback) {
            ary.forEach((item)=> {
                let tmpImg = new Image;
                tmpImg.onload = function () {
                    tmpImg = null;
                    n++;
                    $current.css('width',(n/len)*100+'%');
                    if(n===len){
                        callback&&callback();
                    }
                };
                tmpImg.src = item;
            });
        };
        let done=function () {
            // $loadingBox.remove();
            // clearTimeout(delayTimer);
            //停留一秒之后移除这一页面
            let timer1=setTimeout(()=>{
                $loadingBox.remove();
                 clearTimeout(delayTimer);

             },1000);

        };
        let delayTimer=null;
        let maxDalay=function (callback) {
          delayTimer=setTimeout(()=>{
              if (n / len >= 0.8) {
                  clearTimeout(delayTimer);
                  $current.css('width','100%');
                  callback && callback();
                  return;
              }
              alert('您的网速太慢，请重新刷新');
             // window.location.href= window.location.href;             
          },5000)
        };
        
        return {
            init: function () {
                runTrue(done);
                maxDalay(done);
                phoneRender.init();
            }
        }
    })();
    let phoneRender = (function () {
        let $listenImgBox = $('.listenImgBox'),
            $listen = $listenImgBox.find('img'),
            $phone = $('.phone'),
            $time = $phone.find('span'),
            intro = $('#intro')[0],
            ansbell = $('#ansbell')[0];

        let hang = function () {
            let $detailBox = $('.detailBox'),
                $markLink = $detailBox.find('.markLink');
            //点击接听
            $listen.on('tap', function () {
                //1.REMOVE
                $listenImgBox.remove();
                ansbell.pause();
                $(ansbell).remove();
                //2.show
                $detailBox.css('transform', 'translateY(0rem)');
                $time.css('display', 'block');
                intro.play();
                intro.volume=0.8;
                computedTime();

            });
            //点击挂断
            $markLink.on('tap', closePhone);
        };
        let closePhone = function () {
            clearInterval(autoTimer);
            intro.pause();
            $(intro).remove();
            $phone.remove();
            messageRender.init();
        };
        let autoTimer = null;
        let computedTime = function () {
            autoTimer = setInterval(()=> {
                let val = intro.currentTime + 1,
                    duration = intro.duration;
                //当播放完成
                if (val >= duration) {
                    closePhone();
                    return;
                }
                //计算分钟和秒，显示在span上 24.2
                let min = Math.floor(val / 60),
                    second = Math.floor(val - min);
                second = second <= 9 ? '0' + second : second;
                min = min <= 9 ? '0' + min : min;
                $time.html(`${min}:${second}`);
            }, 1000);

        };
        return {
            init: function () {
                ansbell.play();
                hang();
            }
        }
    })();
    let messageRender=(function(){
        let $message=$('.message'),
            $wrapper = $message.find('.wrapper'),
            $messageList = $wrapper.find('li'),
            $keyBoard = $wrapper.find('.keybord'),
            $textInp = $keyBoard.find('span'),
            $send=$message.find('a'),
            demonMusic = $('#demonMusic')[0];

        let autoTimer=null,
            interval=1600,
            step=-1,//当前信息的索引
            tt=0,
            total=$messageList.length,
            flag=0;
        let showMessage=function () {
            ++step;
            let $currentLi=$messageList.eq(step);
            if($currentLi.attr('class')==='keybord'){
                handleKeyB();
                $currentLi.addClass('active2');
            }
            else{$currentLi.addClass('active'); }
            if(step===1){
                //=>已经展示两条了:此时暂时结束自动信息发送，让键盘出来，开始执行手动发送
                step=total-2;
                return;
            }
            if(step===total-1){
                clearInterval(autoTimer);
                if(flag===1){ removeALL();}
                flag++;
                return;
            }
            if (step >= 3) {
                //=>展示的条数已经是四条或者四条以上了,此时我们让WRAPPER向上移动(移动的距离是新展示这一条的高度)
                /*let curH = $cur[0].offsetHeight,
                 wraT = parseFloat($wrapper.css('top'));
                 $wrapper.css('top', wraT - curH);*/
                //=>JS中基于CSS获取TRANSFORM，得到的结果是一个矩阵
                let curH = $currentLi[0].offsetHeight;
                tt -= curH;
                $wrapper.css('transform', `translateY(${tt}px)`);
            }

        };

        let handleKeyB=function () {
            let str = '好的，马上介绍！',
                n = -1,
                text='',
                len=str.length;
            let timer2=setInterval(()=>{
                if(n>=len-1){clearInterval(timer2) ;return;};
                text+=`${str[++n]}`;
                $textInp.html(text);
            },100);
        };

        let removeALL=function () {
            demonMusic.pause();
            demonMusic.remove();
            $message.remove();
        };
        //点击发送键
        $send.on('tap',function () {

            $keyBoard.remove();

            $message.append(`<div class="keyB">
            <span></span><!--好的，马上介绍！-->
            <a href="javascript:;" class="submit"></a>
        </div>`);

            step=1;
            showMessage();
            autoTimer = setInterval(showMessage, interval);
        });
        return{
             init:function(){
                 demonMusic.play();
                 //=>加载模块立即展示一条信息,后期间隔INTERVAL在发送一条信息
                 showMessage();
                 autoTimer = setInterval(showMessage, interval);
                 cubeRender.init();
             }
            }
    })();
    let cubeRender=(function(){
        let $cubeBox = $('.cubeBox'),
            $cube = $('.cube'),
            $cubeList = $cube.find('li'),
            index=0;

        //=>手指控住旋转
        let start = function start(ev) {
            //=>记录手指按在位置的起始坐标
            let point = ev.changedTouches[0];
            this.strX = point.clientX;
            this.strY = point.clientY;
            this.changeX = 0;
            this.changeY = 0;
        };
        let move=function (ev) {
            let point = ev.changedTouches[0];
            this.changeX=point.clientX-this.strX;
            this.changeY = point.clientY - this.strY;
        };
        let end=function (ev) {
            let {changeX, changeY, rotateX, rotateY} = this,
                isMove = false;
            //=>验证是否发生移动（判断滑动误差）
            Math.abs(changeX) > 10 || Math.abs(changeY) > 10 ? isMove = true : null;
            //=>只有发生移动再处理
            if (isMove) {
                //1.左右滑=>CHANGE-X=>ROTATE-Y (正比:CHANGE越大ROTATE越大)
                //2.上下滑=>CHANGE-Y=>ROTATE-X (反比:CHANGE越大ROTATE越小)
                //3.为了让每一次操作旋转角度小一点，我们可以把移动距离的1/3作为旋转的角度即可
                rotateX = rotateX - changeY / 2;
                rotateY = rotateY + changeX / 2;
                //=>赋值给魔方盒子
                $(this).css('transform', `scale(0.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
                //=>让当前旋转的角度成为下一次起始的角度
                this.rotateX = rotateX;
                this.rotateY = rotateY;
            }
            
            
        };
        return{
             init:function(){
                 //=>手指操作CUBE,让CUBE跟着旋转
                 let cube = $cube[0];
                 cube.rotateX = -35;
                 cube.rotateY = 35;//=>记录初始的旋转角度（存储到自定义属性上）
                 $cube.on('touchstart', start)
                     .on('touchmove', move)
                     .on('touchend', end);

                 $cubeList.on('tap',function () {
                    index=$(this).index();
                     //remove
                     $cubeBox.css('display','none');
                     detailRender.init(index);

                 });
             }
            }
    })();
    let detailRender=(function(){
        let $detailBox=$('.detail'),
            $cubeBox = $('.cubeBox'),
            swiper=null,
            $dl = $('.page6>dl'),
            $return=$detailBox.find('.return');
        let initSwiper=function (index) {
            swiper = new Swiper ('.swiper-container', {
                effect:'coverflow',
                initialSlide :index,
                onTransitionEnd:move
               // onInit:move
            });
        };

        let move=function (swiper) {
            let slideAry=swiper.slides,
                acitveIndex=swiper.activeIndex;
            slideAry.forEach((item,index)=>{
                if(acitveIndex==index){
                    item.id=`page${index + 1}`;//给滑到的当前页加id
                    return;
                }
                //不是当前页，去除id
                item.id=null;
            });

            if (acitveIndex === 5) {
                $dl.makisu({
                    selector: 'dd',
                    overlap: 0.6,
                    speed: 0.8
                });
                $dl.makisu('open');
            } else {
                //=>OTHER PAGE
                $dl.makisu({
                    selector: 'dd',
                    speed: 0
                });
                $dl.makisu('close');
            }

        };
        return{
             init:function(index=0){
                 if(!swiper){//防止重复初始化
                     initSwiper(index);
                 }
                 swiper.slideTo(index,1000);
                 $return.on('tap',function () {
                     $cubeBox.css('display','block');
                 });
                 // $return[0].addEventListener('',function () {
                 //     console.log(1);
                 //     $cubeBox.css('display','block');
                 // });
             }
            }
    })();


    let url=window.location.href;
    let hash=url.indexOf('#')>-1?url.substring(url.indexOf('#')+1):null;

    switch (hash)
    {
        case 'phone':
            phoneRender.init();
            break;
        case 'msg':
            messageRender.init();
            break;
        case 'cube':
            cubeRender.init();
            break;
        case 'detail':
            detailRender.init();
            
        default:
            loadingRender.init();
            break;
    }

});
