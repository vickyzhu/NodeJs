$(function(){

    $('.del').click(function(){
        var $target=$(this),
            _id=$target.data('id'),
            $tr=$('.item-id-'+_id);
        $.ajax({
            type:'DELETE',
            url:'/admin/movie/list?id='+_id

        })
        .done(function(result){
            if(result.success==1){
                if($tr.length>0){
                    $tr.fadeOut();
                }
            }
        });
        return false;
    });
    //获取豆瓣数据
    $('#douban').blur(function() {
        var douban = $(this)
        var id = douban.val()

        if (id) {
            $.ajax({
                url: 'https://api.douban.com/v2/movie/subject/' + id,
                cache: true,
                type: 'get',
                dataType: 'jsonp',
                crossDomain: true,
                jsonp: 'callback',
                success: function(data) {
                    $('#inputTitle').val(data.title)
                    $('#inputDoctor').val(data.directors[0].name)
                    $('#inputCountry').val(data.countries[0])
                    $('#inputPoster').val(data.images.large)
                    $('#inputYear').val(data.year)
                    $('#inputSummary').val(data.summary)
                }
            })
        }
    })
});