document.getElementById('search').onsubmit = function(){
    var api_key = 'RGAPI-225ffd4e-6c29-423d-9d29-6271186f0f89';
    var name = this.name.value;

    var name_output = document.querySelector('#username');
    var icon_output = document.querySelector('#icon');
    var level_output = document.querySelector('#level');
    //닉네임, 아이콘, 레벨 html

    var tier_output = document.querySelector('#tier');
    var rank_output = document.querySelector('#rank');
    var lp_output = document.querySelector('#lp');
    var win_lose_output = document.querySelector('#win_lose');
    var win_rate_output = document.querySelector('#win_rate');
    //랭크 정보 html

    
    fetch('https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+name+'?api_key='+api_key)
    .then(reponse=>reponse.json())
    .then(data => {
        var puuid = data['puuid'];
        var icon_code = data['profileIconId'];
        var level = data['summonerLevel'];
        var encryptedID = data['id'];
    //소환사 정보를 가져와서 값을 저장

        name_output.innerHTML = name;
        icon_output.innerHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/11.24.1/img/profileicon/'+icon_code+'.png" width="128px" height="128px">';
        level_output.innerHTML = 'Lv.'+level;
    //닉네임, 아이콘, 레벨 출력

        fetch('https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/'+encryptedID+'?api_key='+api_key)
        .then(response=>response.json())
        .then(data => {
            var length = data.length;
            var solo;

            for(var i=0;i<length;i++){
                if(data[i]['queueType'] == 'RANKED_SOLO_5x5'){
                    solo=i;
                }
            }
            //솔로랭크 배열 찾기

            var solo_tier = data[solo]['tier'];
            var solo_rank = data[solo]['rank'];
            var solo_lp = data[solo]['leaguePoints'];
            var solo_win = data[solo]['wins'];
            var solo_lose = data[solo]['losses'];
            //솔로랭크 티어 정보

            tier_output.innerHTML = '<img src="./img/Emblem_'+solo_tier+'.png" width="128px" height="128px">';
            rank_output.innerHTML = solo_tier+' '+solo_rank;
            lp_output.innerHTML = solo_lp+' LP';
            win_lose_output.innerHTML = solo_win+'승 '+solo_lose+'패 ('+((solo_win/(solo_win+solo_lose))*100).toFixed(1)+'%)';
            //솔로랭크 티어 정보 출력
        })

        fetch('https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/'+puuid+'/ids?start=0&count=20&api_key='+api_key)
        .then(response=>response.json())
        .then(data=>{
        //puuid로 match id값 가져오기

        document.getElementById("Base").innerHTML = "";
            
            for(var i=0;i<18;i++){
            fetch('https://asia.api.riotgames.com/lol/match/v5/matches/'+data[i]+'?api_key='+api_key)
            .then(response=>response.json())
            .then(data=>{
                //match id로 매칭 정보 가져오기
                
                var gameID_main = data['info']['gameId'];

                var div = document.createElement('div');
                        div.className = gameID_main;
                        document.getElementById('Base').appendChild(div);
                        //gameid를 class값에 넣어 div로 나눔

                for(var j=0;j<10;j++){
                    if(data['info']['participants'][j]['summonerName'] == name){
                        //검색한 소환사 정보 출력

                        var gameID = data['info']['gameId']+'me';

                        var div = document.createElement('div');
                        div.className = gameID;
                        document.getElementsByClassName(gameID_main)[0].appendChild(div);
                        //gameid를 class값에 넣어 div로 나눔

                        var p = document.createElement('p');
                        if(data['info']['participants'][j]['win']==true){
                            p.innerText = '승리'+' ('+data['info']['gameMode']+')';
                            document.getElementsByClassName(gameID)[0].appendChild(p);
                            document.getElementsByClassName(gameID)[0].style.backgroundColor='#03A9F4';
                        }
                        else{
                            p.innerText = '패배'+' ('+data['info']['gameMode']+')';
                            document.getElementsByClassName(gameID)[0].appendChild(p)+'-'+data['info']['gameMode'];
                            document.getElementsByClassName(gameID)[0].style.backgroundColor='#E57373';
                        }
                        //승패 여부 - 게임 모드 출력


                        var img = document.createElement('img');
                        img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/champion/'+data['info']['participants'][j]['championName']+'.png';
                        img.alt = data['info']['participants'][j]['championName'];
                        img.width = '64';
                        img.height = '64';
                        img.className = i;
                        document.getElementsByClassName(gameID)[0].appendChild(img);
                        //유저 챔피언 일러스트 출력

                        var p = document.createElement('p');
                        p.innerText = data['info']['participants'][j]['championName'];
                        document.getElementsByClassName(gameID)[0].appendChild(p);
                        //유저 챔피언 이름 출력
                        
                        var spell1 = data['info']['participants'][j]['summoner1Id'];
                        var spell2 = data['info']['participants'][j]['summoner2Id'];

                        switch(spell1){
                            //첫번째 스펠 구하기
                            case 21:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerBarrier.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //방어막

                            case 1:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerBoost.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //정화

                            case 14:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerDot.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //점화

                            case 3:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerExhaust.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //탈진

                            case 4:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerFlash.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //점멸

                            case 6:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerHaste.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //유체화

                            case 7:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerHeal.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //회복

                            case 13:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerMana.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //총명

                            case 11:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerSmite.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //강타

                            case 32:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerSnowURFSnowball_Mark.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //눈덩이

                            case 12:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerTeleport.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //텔레포트

                            case 54:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/Summoner_UltBookPlaceholder.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //궁극기모드
                        }

                        switch(spell2){
                            //두번째 스펠 구하기
                            case 21:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerBarrier.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //방어막

                            case 1:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerBoost.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //정화

                            case 14:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerDot.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //점화

                            case 3:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerExhaust.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //탈진

                            case 4:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerFlash.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //점멸

                            case 6:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerHaste.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //유체화

                            case 7:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerHeal.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //회복

                            case 13:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerMana.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //총명

                            case 11:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerSmite.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //강타

                            case 32:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerSnowURFSnowball_Mark.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //눈덩이

                            case 12:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/SummonerTeleport.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //텔레포트

                            case 54:
                                var img = document.createElement('img');
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/spell/Summoner_UltBookPlaceholder.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);

                                break;
                                //궁극기모드
                        }
                        
                        var br = document.createElement('br');
                        document.getElementsByClassName(gameID)[0].appendChild(br);

                        for(var t=0;t<7;t++){
                            if(data['info']['participants'][j]['item'+t] == 0){
                                var span = document.createElement('span');
                                span.style.display = 'inline-block';
                                span.style.width = '32px';
                                span.style.height = '32px';
                                span.style.backgroundColor = '#1f1f1f';
                                span.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(span);
                            }
                            else{
                                var img = document.createElement('img');    
                                img.src = 'http://ddragon.leagueoflegends.com/cdn/11.24.1/img/item/'+data['info']['participants'][j]['item'+t]+'.png';
                                img.width = '32';
                                img.height = '32';
                                img.style.border = '1px solid black';
                                document.getElementsByClassName(gameID)[0].appendChild(img);
                            }
                        }
                        //아이템 출력

                        

                        var p = document.createElement('p');
                        var time = data['info']['gameDuration'];
                        var min = Math.round(time/60);
                        var sec = Math.abs(Math.round((min - ((time/60).toFixed(2)))*100));
                        p.innerText = +min+'분 '+sec+'초';
                        document.getElementsByClassName(gameID)[0].appendChild(p);
                        //게임 시간 출력

                        var p = document.createElement('p');
                        p.innerText = +data['info']['participants'][j]['kills']+'/'+data['info']['participants'][j]['deaths']+'/'+data['info']['participants'][j]['assists'];
                        document.getElementsByClassName(gameID)[0].appendChild(p);
                        //kda 출력

                        var p = document.createElement('p');
                        p.innerText = '평점 '+((data['info']['participants'][j]['kills'] + data['info']['participants'][j]['assists']) / data['info']['participants'][j]['deaths']).toFixed(2)+':1';
                        document.getElementsByClassName(gameID)[0].appendChild(p);
                        //평점 출력

                        var p = document.createElement('p');
                        p.innerText = '피해량 : '+data['info']['participants'][j]['totalDamageDealtToChampions'];
                        document.getElementsByClassName(gameID)[0].appendChild(p);
                        //데미지 출력

                        var br = document.createElement('br');
                        document.getElementsByClassName(gameID)[0].appendChild(br);
                    
                        
                    }
                }
            })
        }
        })
    })
    return false;
}