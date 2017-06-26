 // main document ready function to check if dom is loaded fully or not
 $(document).ready(function() {

     var myFacebookToken = 'EAACEdEose0cBAFmmFVB6sZA6RS60ZBlKC1ieNMfdrWmGoOiqFCJK1sHIn3lqnCpQoEBuRr5W2Eki9CXysTZB5CiyhplRsghMObg72a8Xax1gMpN6JxXSZAwnLKxC0ktkwtyDTCmpxITVMn8vWSEcZCuNUFgAEGnHMKvHZAZA16TnaJEGgLVZBekSrRgYp62SIBoZD';
    

      
     //get profile option Information
     function getProfileInfo() {

         $.ajax('https://graph.facebook.com/me/?fields=name,email,id,picture,hometown,birthday,gender,first_name&access_token=' + myFacebookToken, {

                 success: function(response) {
                     console.log(response);
                     var myId = response.id;
                     $("#myEmail").text(response.email);
                     $("#myProfileId").html('<a target="blank" href="https://facebook.com/' + myId + '">View On Facebook</a>');
                     $("#myHomeTown").html('<img src="' + response.picture.data.url + '" alt="Smiley face" style="height:120px;width:100px">');
                     $("#fullName").html(response.name);
                 }, //end success
                 error: function(response) {
                     alert(JSON.stringify(response));
                     $(".initial-div").show();
                 },
                 timout: 7000,
                 beforSend: function(response) {

                 },
                 complete: function(response) {
                     $(".initial-div").hide();
                 }


             } //end argument list 



         ); // end ajax call 
         //call function to load initial feed data
         getFeedWrapper();

     } // end get facebook info
     
     //a wrapper funtion to declare closure to store next feed link for ajax call for dynamic loading of content on scroll
     function getFeedWrapper() {
         getFeed();
     }

     //funtion to get user's feed
     var getFeed = function() {

         //var nextLink = '';
         var link = ''; //https://graph.facebook.com/me/posts?fields=id,message,permalink_url,picture,link,name,likes,comments,created_time,full_picture,place&access_token='+myFacebookToken;
         //if (nextLink == '') {
             link = 'https://graph.facebook.com/me/posts?fields=id,message,permalink_url,picture,link,name,likes{pic,username,name,link},comments{id,from{id, name, picture},message},created_time,full_picture,place&access_token=' + myFacebookToken;
         //} else {
         //    link = nextLink;
         //}
         return function(){
           
            if(link != ''){
                $('.loader').css("display", "block");
                $.ajax(link, {

                 success: function(response) {
                     var obj = response.data;
                     console.log(JSON.stringify(response));
                     //alert(typeof(response.posts.data[0]));
                     //$("#feed-wrapper").empty();
                     //$("#feed-con").text(obj);
                     
                     //link = response.paging.next;
                     if(response.paging){
                        link = response.paging.next;                 
                     }else{
                        link = '';
                     }
                     for (var i in obj) {
                         var date = new Date(obj[i].created_time);
                         var day = ''; //date.getDay();
                         var date = ''; //date.getDate();
                         var mon = ''; //date.getMonth();
                         var year = ''; //date.getFullYear();
                         var hour = ''; //date.getHours();
                         var min = ''; //date.getMinutes();
                         var comments = '';
                         var likes = '';
                         var time = date; //day + ' ' + date + ' ' + mon + ' ' + year + ' ' + hour + ':' + min;
                         if(obj[i].comments){
                           //for(var j in obj[i].comments){
                                for(var data in obj[i].comments.data){
                                    comments += '<div id="show-comments"><p>'+obj[i].comments.data[data].message+'</p><p><span><img src="' + obj[i].comments.data[data].from.picture.data.url + '" alt="Smiley face" style="height:70px;width:50px"></span>'+obj[i].comments.data[data].from.name+'</p><p><a target="blank" href="https://www.facebook.com/'+ obj[i].comments.data[data].from.id + '">View User On Facebook</a></p></div>';
                                }
                                
                            //}
                         }

                         if(obj[i].likes){
                            
                                for(var data in obj[i].likes.data){
                                    likes += '<div id="show-likes"><p><span><img src="' + obj[i].likes.data[data].pic + '" alt="Smiley face" style="height:70px;width:50px"></span>'+obj[i].likes.data[data].name+'</p><p><a target="blank" href="https://www.facebook.com/'+ obj[i].likes.data[data].id + '">View User On Facebook</a></p></div>';
                                }
                         }
                         
                         if (obj[i].message) {

                             $("#feed-wrapper").append('<div class="feed-div"><h4>' + obj[i].message + '</h4><p>Created-On:' + new Date(obj[i].created_time) + '</p><p><a href=' + obj[i].permalink_url + ' target="_blank">View On facebook</a></p><p><a id="commentBtn" href="#" ">Comments</a><a id="commentBtnClose" href="#"  style="display:none">CommentsClose</a><div class="comment-div" style="display:none">'+comments+'</div></p><p"><a  id= "likeBtn" href="#"">Likes</a><a  id= "likeBtnClose" href="#"  style="display:none">LikeClose</a><div class="like-div" id="like-div-id"  style="display:none">'+likes+'</div></p></div>');
                            
                         } else {
                             $("#feed-wrapper").append('<div class="feed-div"><h4>' + obj[i].name + '</h4><p>Created-On:' + new Date(obj[i].created_time) + '</p><p><a href=' + obj[i].permalink_url + ' target="_blank">View On facebook</a></p><p><a id="commentBtn" href="#" ">Comments</a><a id="commentBtnClose" href="#"  style="display:none">CommentsClose</a><div class="comment-div" style="display:none">'+comments+'</div></p><p><a id="likeBtn" href="#"">Likes</a><a  id= "likeBtnClose" href="#">LikeClose</a><div class="like-div" style="display:none">'+likes+'</div></p></div>');
                         }
                     }

                 },

                 error: function(response) {
                     alert(JSON.stringify(response));
                 },
                 timout: 7000,
                 beforSend: function(response) {
                    //$("#feed-wrapper").append('<div class="loader"></div>');
                    $('.loader').css("display", "block");
                    //alert('hello');
                 },
                 complete: function(response) {
                    $('.loader').css("display", "none");
                 }


             } //end argument list 
         ); // end ajax call 
            }
         
        }
     }(); // end get facebook info

     
    //functions for hiding and showing coments and likes
     $("#facebookBtn").on('click', getProfileInfo);
     $("#feed-wrapper").on('click', '#commentBtn', function(){
          $("#commentBtnClose").show(1000);
         $(".comment-div").show(1000);
     });
     $("#feed-wrapper").on('click', '#likeBtn', function(){
         $("#likeBtnClose").show(1000);
        $(".like-div").show(1000);
     });
     $("#feed-wrapper").on('click', '#likeBtnClose', function(){
        $("#likeBtnClose").hide(1000);
        $(".like-div").hide(1000);
     });
      $("#feed-wrapper").on('click', '#commentBtnClose', function(){
         $("#commentBtnClose").hide(1000);
        $(".comment-div").hide(1000);
     });

     /*$(window).scroll(function() {
         var scrollTop = $(this).scrollTop();
         $("body").css("top", -(scrollTop / 8) + 'px');
     });*/
     $(window).scroll(function() {
         //$('.profile-wrapper').css("position", "fixed");
        if($(window).scrollTop() == $(document).height() - $(window).height()) {
              
               getFeedWrapper();
        }
    });

    
 });
