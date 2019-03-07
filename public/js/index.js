$(function(){
    var loginBox=$('#loginBox');
    var registerBox = $('#registerBox');
    var UserIofo=$('#UserIofo');

    loginBox.find('a.cloMint').on('click',function(){
        registerBox.show();
        loginBox.hide();
    })

    registerBox.find('a.cloMint').on('click',function(){
        loginBox.show();
        registerBox.hide();
    })

    registerBox.find('button').on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:registerBox.find('[name=z_username]').val(),
                password:registerBox.find('[name=z_password]').val(),
                repassword:registerBox.find('[name=z_repassword]').val()
            },
            dataType:'json',
            success:function(result){
                registerBox.find('.tip').html(result.message);
                if(!result.code){
                    setTimeout(function(){
                        loginBox.show();
                        registerBox.hide();
                    },1000);
                }
            }
        });
    })
    loginBox.find('button').on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:loginBox.find('[name=d_username]').val(),
                password:loginBox.find('[name=d_password]').val(),
            },
            dataType:'json',
            success:function(result){
                console.log(result);
                loginBox.find('.info').html(result.message);
                if(!result.code){
                    window.location.reload();
                }
            }
        });
    })
    $('#logout').on('click',function(){
        $.ajax({
            url:'/api/user/logout',
            success:function(result){
                console.log(result);
                if(!result.code){
                    window.location.reload();
                }
            }
        });
    })


    var comments 
    $('#messageBtn').on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/comment/post',
            data:{
                contentId:$('#contentId').val(),
                messageContent:$('#messageContent').val()
            },
            dataType:'json',
            success:function(result){
                $('#messageContent').val('');
                comments = result.data.comments.reverse();
                renderComment();
            }
        });
    })

    var parerPage=2;
    var page = 1;
    var pages = 0;
   

    $.ajax({
        url:'/api/comment',
        data:{
            contentId:$('#contentId').val()
        },
        dataType:'json',
        success:function(result){
            comments = result.data.comments.reverse();
            renderComment();
        }
    });

    $('.pager ').delegate('a','click',function(){
        if($(this).parent().hasClass('previous')){
            page--;
        }else{
            page++;
        }
        renderComment();
    })
    function renderComment(){
        $('#messageCount').html(comments.length);
        pages = Math.ceil(comments.length / parerPage);
        var start = (page-1)*parerPage;
        var end = start+parerPage;
        var lis = $('.pager li');
        lis.eq(1).html(page + '/'+pages);
        if(page<=1){
            page=1;
            lis.eq(0).html("没有上一页了");
        }else{
            lis.eq(0).html('<a href="javascript:;">上一页</a>');
        }
        if(page>=pages){
            page=pages;
            lis.eq(2).html("没有下一页了");
        }else{
            lis.eq(2).html('<a href="javascript:;">下一页</a>');
        }
        if(end>=comments.length){
            end=comments.length
        }

        var html=``;
        for(var i = start;i<end;i++){
            html+=`
            <p class="name clear">
                <span class="fl">${comments[i].username}</span><span class="fl">${formateData(comments[i].postTime)}</span>
            </p>
            <p class="name clear">
                ${comments[i].content}
            </p>
            `
        }
        $('#commentsList').html(html);
    }

    function formateData(d){
        var date = new Date(d);
        return date.getFullYear()+'年'+date.getMonth()+'月'+date.getDate()+'时'+date.getHours() +':'+date.getMinutes()+':'+date.getSeconds();
    }
});