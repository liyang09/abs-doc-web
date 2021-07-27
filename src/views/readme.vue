<template>
    <div>
        <div>
            <!-- <div class='mainContent workbench'>
            <div class="empty">
                    <img :src='$global.imgUrl.empty' />
                    <p>暂无项目公司，快去创建吧</p>
                    <div class="textCenter">
                        <el-button type="primary" icon="iconfont iconplus">新建项目公司</el-button>
                    </div>
                </div>
            </div> -->
            <div class='workbenchCont'>
            <div class='contLeft fl'>
                <span class='circle'></span>
                <div style='background: #fff;margin: 0 0 20px 0;width:100%;position:relative' class="borderRadiu12">
                    <el-select v-model="selectedVal" @change="selectChange" placeholder="请选择" class="type-select">
                        <el-option
                        v-for="item in selectOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <div class="total-amount">
                        <span>资产总金额：{{statisticData.totalAmountOfAssets}} （元）</span>
                    </div>
                    <div id="myChart" :style="{width: '100%', height: '460px', margin: '0 0 12px'}"></div>
                </div>
                <div class='tableWrap borderRadiu12'>
                    
                </div>
            </div>
            <el-col :span='6' class='contRight boxSizing fr'>
                 <div class='clearfix' style='height: 490px;'>
                    <el-col
                        :span='12'
                        v-for='(item, key) in operStatistic' :key='item.id'
                        class='operList textCenter boxSizing fl cursor'>
                        <router-link :to="{path: item.path}" @click.native="refresh">
                            <img class='icon' :src='item.icon'/>
                            <p class='tit'>{{item.name}}</p>
                            <p class='num'>{{statisticData[key]}}</p>
                        </router-link>
                    </el-col>
                </div>

                <!-- :style='{background: "url(" + $global.imgUrl.empty + ") #fff no-repeat center center"}' -->
                <div class='project textCenter'>
                    <div>
                        <img style='width: 130px; height: auto;' :src="$global.imgUrl.companyEmpty" />
                        <p class='textCenter'>
                            <el-button type='primary' @click="company()">查看项目公司</el-button>
                            <el-button type='primary' class='newBtn' icon='plus' @click="company()">新建项目公司</el-button>
                        </p>
                    </div>
                </div>
            </el-col>
        </div>
        <add-project ref="addOrEditProject"></add-project>
        </div>
    </div>
</template>
<script>
    import{mapState} from 'vuex';
    import echarts from 'echarts'
    import addProject from '../views/company/addProject.vue';
    var curInt = null

    export default {
        name: 'readme',
        data () {
            return {
                currentShow:true,
                isCursor:true,
                content:[],
                content2:[],
                orgName:JSON.parse(sessionStorage.getItem('user')).orgName,
                userName: JSON.parse(sessionStorage.getItem('user')).username,
                subMenuList:[],
                quantityLabel: [],
                quantityData: [],
                selectOptions: [{
                    value: 'company',
                    label: '项目总览'
                }, {
                    value: 'city',
                    label: '区域总览'
                }],
                selectedVal: 'company',
                selectCompay:{},
                statisticData: {
                    submitted: 0,
                    toBeEntry: 0,
                    toBeSubmit: 0,
                    feedBack: 0,
                    statisticData: 0
                },
                operStatistic: {
                    toBeSubmit: {
                        name: '待提交',
                        path: '/commonAsset2/com.evisible.entity.base.common.entity.AssetEntity',
                        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAABoCAYAAAAZ6WWcAAAVR0lEQVR4Xu2dbYwkx1nH/1U90zOz87Zvsy/nu7V98YlwjpyQDcZWQBx8cYA4iYCTHEAgIrBIQgAhkBIZcz5bAQRJkECByIn4AN+4I0IkIgYF6ZDiOEIcsUm8WLoXO+v17d3O7evM7Mz0THehp3p6pqene6p7dq/39s4lnWZuu7rr5df/53mquqeKYT+TEGw/L3for8WY2K82jN6xb0MZjcGI8KKDCgPo7Fn7umfOjNaYw3rW2bN2zc+cUSspIrDwoIYBIjBuKOfO9V/3tNPz3S+HFYWn3ufs/3c+ugdPn+6BInjDwIUEpgYVBMgNxwFz+jRw4ULvmqecqp8CLl5Ul3UY8S0uCuCCXfPOh/x+6pTAuQ5BB9wwaApgwzsvWEX2eQTIDSeft/+evsqAk/3dvrx8Z4JaWPCYuSWgcdz+W6VifzrQekrzN41DYAV3nh8kR0VuQATn6lWGkycBgnHiBLCywnBfh9Nq6s4E5FX/fNPu/DcAHD0qcOkSQBCXloDjx4WE5gYWpK4AWP6dqIJUKjEQIFLOco4hk7HBEBR9nQHzQJI+Kc0BGxt3NqzJSQFct5vbmhLAKmBMCRA8AlevCyxUhVQaASuXBUhdEWANdqC/uXPyMemDCNLaGpeAUgRHZxIMm9eTR4ofZAIfBGM/AsbmIKy8c/N59c6Yp3gRECx586GTb/CCnaL8j9/S8hmvQIjrEOK7gplfb12rfh1i1ZDgDEOg2RQS2MyM1VUXnIZ0P3s69SgrDKgeJFxgeLXMkcoxlKsceoYhucCgbTB9duFD4InnhMBxpzTvxQc6qr9bu5UcVX5B1w+8UW5h+YzhKlrtp42by/8Cc1KgtSxg1AVKOQvNqsCDJQs4RVV2qt1f/aGgvGrqRXYMF5/nSL+foUygUgzZCoemM2TyWrJYOgvGfgfKMZZdFwYbRVhwXvDqQYrXgfSjiq186mwh/qq1XT6DesWEaQjU8pZUV6lkofGiwOKTluwKPzPogtV/87o72g1JKqnEe5CyHJUKx2yCJYuzz0lIruSYNOGj6KAu9CPnWLwumJBkb7vyLYJ142ncaAvk8xZqtR6sB8s9ZXlh+YIaVAOT4TcFDqUyR7nE8UCKYSPLkapwVOtcP/aOx4Wm/b1aSUPx3PkHGRPMNH/VePPK15DLWGjmLUzWLFwmZZUtlEtWN8DwGpoOrJ6i+kH1IFHgUFzjKI9zZB1IaY5kM6Ufuec7AuJ+dU/v1VuNbuzsut0W5b/euvbWI2ilmsg1bFikrNKWhe1OgOFEg25YfaCCTN7Fi1xGd+NVjmyRo5LlSNc59DRPlo58BAn+d76QVP2q6jfvRYPyB0Udt2v5pvWxVvnaP8NoWGhkLORrFmrbFrZylowGFxf9/RUp0vYNfY8nBk1evsqRznGkMhzXWxr0Jk/cf/xLDOwX1WoalkMVp+3t6uqz4y1fQJxvv371t2CkLMwlTTTrFhpVC5WcNdQEBoIiW9FVk8vk1Vsa6ilOoJL33vsSBB7o7wznFlfd0uouHC3HbV/+5dbyDx6VoDJNCxmC1TGBW1v9qvKYv35FUaR38qQdQFAYXipx5PMc6QpHo62RyUNdJ//Ek0ePXgWQG61D79qzqq2VleNoESjDkiYwnTDRyNMgmAIKS4bt5KuWlkR31t1HUS6zV+LIljl2DA2pLAepSU9x1JscSZ0n5+ZvRB8JdQB14+6Q8XaXq8q5hVTUAZbfun59Fi3DQiZlwXBUVbNQ0E3UJKTBCFCC8vonr9lrNjVkMhwtAmWrCZrGknNzN+5aXeyh4RKUaQqpKsOwkEyaqNctpFImhpi/QVAXLpC5YygWObZf02QQ4Zg9o62hqXMUNJacKXVmIfdQ67vw1NZaeQ47pkDKsKAnzJ75q1oovtPE9rYzF2hHgI4R6irK7Z+cAS75p0ZDw3ya44Yhoz0ye+AaS5amu6BCx04dkyM8k69Blqg7F6uITQ5T+RKURYoiH5WyMKubWCVflTaln3IPgF1+qqeoPlAB/qnZ1sjsoWnwxMKx1biHMWGBqGJOlacLGsbtR/nt5TfnkdItaf5SpKghfsoXFPkm+UCwZM/rOYFEvaghleIw1jWpJkPnyHGWnJ5c7VVc1TXeIN6ZlB3e9F5o4JlYHpjUPTzlt29uzqNqCeiGJVWlT5loEqxtsxtQ0Pzfuc4zq475c/uoflA7O5qcMqrXtb5AgmAxzhJTE6sDd16AaQt0RWFv7ZD5upOxQc+1ws54jJgvTPnt9c15CMs2fe6AIpMx5ZRSoWBCCQr09tBphldf5SBQfhHfEFB3YWwQucmBoJzIT4J60ALOCUC+zSTNRb+iCNTF4535vXHeBTVGMxKd0LwLanxAUZFrfZueMM01PJObxBPpPL6yu4NPV2/uW03b61v9iqKB765fiH7VGgLKM3VEijqasQe7BKgz2JWmb3J8tTspHdbLepurci0qkxc0vg37iNhTfpIBHx8bx9O5SYxzTda2blkorF2xax52fD6k/D5QNOiVg9+kiZXhYymPolSgkhxJw/ZRk8XV3uODsKTCtjRq3LX38h9LZfG5wjTemUj1Ff5qq4n33Fzu/C1s/YPj4fbGdkdRuoVMKy5Q+2YRDuxCJzRdAvrZtP+05fl6BR/d2j8rHz+oiWLP9O23SYsqqBHKLzKOp3KT+GR2AvrAW069Cz5buYnnqhvDTV+E8tubcSuKQEV9J2LfdBNy8tWnPA7gY2NFnM1PY0ZLKGv0xMY1/FOj4sk3evntzZ2YTd9EYf/sgbK79ifDT+gZfKE4g/ck06Ev+NDa6/i/thE6vyrj4QDlHYgqJ/lUzQ53/F4tgT8rlPAL6TwGXvoEsGmZoBiv0In0nKsaQmB89RJa+2U5hEB7qxKvorTxfFdRqmh41Fhp1POcjs4yjj/MT+L3c5PIMDJ6g+lSy8BSu4kPZ7ov9HYzLbWaIEU5adTRgLsd5kGAGrXiQTpQBdlRwP1SpoA/KZZwj5YMlN23m7s4V69Ic+intPP1HXx041r3/CjlBxV6AIrKxeijwjvvh5Pkh2bxSCoz1C7+4+4OvljdwAulhUC1PbtTBkV9wePFcKbXncvcqsZs+orRQalc0sBcang+mNcS+GyhhF8ZK4IPCbep0/585yb+uraJl2buw9EhintifQXnKeJTzaCE5EXVascPKuuamQhrzLzW3vm/qieCX+xLM4bfy03i0/lp5Li/H3JKaQmBT22t4h9qO/hmaQGPpsaGdvFDN66A/FTwC5xRvTNgbtfiVhSBOtj0kUwef1Gcxf0JXVmRHcsEKeTfmzV8eeIIfj07PvQcglp467X9i/g6pcUPquADKoKpkvVWTboGdOVDyTQ+Pz6Ln0pnlYAow0q7hcdvLuN7rSY+lZvEX07MKc9bajXw0HV6Iy5CCtF+cyduRfmB2i9jHtA30zyBZwol/GZuAprCDzmXeNmo40M338Q1s4WfTmfxr9P3IhHi3PO721KB/mnUlxAAc2c3ZtNXGIvN9CXA8IncBJ4uzmDCMygddr9/gyZU11dQFRaOJ3S8NHM/pkJMG9E1n91eA0V9+53iB5XPrEIZxnmaGdXUMeCxdBafG5/HDyf7Hz+oOvBLlQ387tYqTAEZZHxr5n68Sw8/dfTEzTdB46i+FHVmxWfgdTCgVL21h+Mnkil8bnwOP+czYzDsspYQ+MzWDXxejn9sN3h+egEfHitEqs1Dq5c6EV+k05SZzUo9ZtNHiroFqcg5nirM4LfzU0MfP/gVTU9jf219BV91KeGZ4gz+qDgTqaYy4nvzVbQinRUuc+ygeC69GvSrdtVUUNdkOm0TQk7hPJrK4g+KJZRC+hF319QsC3+8uYr/au52Q5ofTWXxhckjA8WpunS5beCX137Qyxb44qjHlndM47D2m9VGzIrKpV3v9dltUg3/vB3kNKigJfBgJg/6HCXVTBP/s7uNumV2T89pCfxYdjx0dOgu93qrif/d7fmn/Zjjc65/W4IKnm+wjzi/Tj9FZk4xqxAEcLPdwnd3t0HmyrlRkozhkdwEMhEiRPf1rzRquNzc7f4pbDAeJlay4lYUz6VWe8sAdJCobF7A8YezE5hIBM9yB0FaNRr4fr0Cy7VACFmp92UnMDnC9ZxyXtndBqlKlUZpv1Vrxmv6eDY1cjDhHcDT4PVIMo1jqQzyIc2fvOsbtYG+PJnJ4ZhiDk8F4MXKOqpmz4yq8kc5fgCg9BCvi0WVGDCR0HFMz2A2mfKdBafwe6lewVtGfeDxwzF9DCfHBh8ARupIIfAf2+WOSlXGTPVEbrD98YMa04PfQgrqmQheWWcc9+gZqTLH17SEhVdq21hvdd5hcPUjAX5fdlz5iEMFrWq2QYryTar7TnVxAVi7Rsymj0B1U9QWqPI7x20S00kdR/QMrjZqoI70pgzneGQPAUlfxGc08Eptq/OnsHGsqj29Eg4AVNLneZTquZLqlot6nEEDw8P5CRT2EDy4S71cr+JKoxqyIirTOHgZa7cVt6II1B5T+BsxsKB3Z8cxF2EOT1XjV6pbuN5qqLKNfDx+UBkfUAO+VaWwsHekvwm6L53FD+0xePD2+IvbZR/zGtIEhmi/VW/HrKhMYu+KGvm+tE98b34SpYiz6sOKpIjym5s3EHlVtAjtuEtBTaA05K1X+lG332tgQf0qI77t/X8G5S4vdlAsrXV/bD3gagIX3Bh+6wW6rI5J8T4OWiRFBfincquB71W3ME8hfnoMuSFvGzm1um7U8XJls1vJrsELKD9wFDWk/VbDjNf0DQPlxRF1WBj2/CBQNbON72yX5fwfJSp/IpGSwGb1dOBY63K9gsu73h8EqH8FFtYTUz4RPyge2kc5c2IOAK8PGJgz645ibMSDHWH/ZTE/NaColmXhpe0ydq3eeMtdvhxIp8dwNDWGMc901cuVDZCqnBS0pGnUF/3c5cevqBQfnJlQ3Vq9HugXjeq8AEkuFvpBkU/678oG1g1FeM1slUzT/GI6KwOSprDw7a01GBYtmOJJKpPQuwOVYYVoWjGbPgJ1wMkL6rXaFt6oD07UqqqZZByWsHBrpmE992T8oJgPqBAvtql6LcLx9xamMKPb75ivNGr4ftWZ+lFJNEIhkbKq2y+aIm5F+YBSzTREmJQN0z+zegbvyk1gs9UE+RcaB/Ul1Xg6rEkLUxk/Z+pTvjDiBqUTqLA9H9Xoq4gHOQX1HW2fqSJ068oXBmJWlE4bULydovZA/KCSiL4gyNsChGjFraikGEFRo5qc/QoODr78QwIqqqG48/KLFovZR/UpSuV8A44Hvcvt5aPMd3jKFy0eM6iENfgCpmcyUmWwgp7yqLo9MOY7DOW3DwDUwI0fMPMSNZgOO/w5lOXHDQoJ81LkBeo7Uhl126Cwo6RAz3bQ5QNVtLUT9gqYMa0uhoT5LQi8w69TRnwctW+Rw21bPsMVtLUfjwFUZzltxhk084sAfn603u1/HSx4hiOqcQtbm4Mqn30VJv9kd03Z0RdWDL9UKZLm47DE82G7pi9f2GhhpIuHOOnAymdPwtS+1rf472hLlYZf/BfgOjTjP4HujrtRn6ftfUEUVdShYrZXpxelfIY3YOo/CViG7yrNkRb/da97rlhOG40GQy7xMxD4Svxb5+21h1UEVccjlk+7qjH+G6ga30A6Lfa+nHaEBeolKM4Z0tpTgPUJVdPu7uP8b9AwPwvLEhLUnhaoj7jlA+3PIUEZLY5C+jNg4uOw+nZ2U7Pp3pgRnUbYkbKqBre6fLk/Iftb7DT+FHrSkqBoX449bfkQcRMV2p9DgnJSin8ATDwNIZxd4lXddGcfZ+wNCPYcmtYL3YYSKIK0p01U7KvRFuOhtiWiJbUlKDKBTtJFAtA+AG49BoF3A5iNPCg+vPjolwU3wPAKLPFvAF6AwXqvQpHJI1A02N3TtkQOqJAbfdmK6pi/w9u58dXca/Yib/RFVe3tyhZ66zwJyU9V8TX98JTkVpNj9iJvnecGFWEzSmcfKQlsbAx9JvDwdOGtrylB2t1FXxCxD5tR2n4qxPauEpDhmL+3YfkSd0MiJemdQGLP27s6fsq7R7zPhsm2onQOrc5sVWVtVb2tLsixEqlIftZsNZkZe19D2oltXzZMJvN35oytrCFbkMudbwgWQXI+6/UeMOcWI3B3QyIwTnIAZTL2uIngOJ/SN426BXl/QGFDclQldxBd4yi7driupjn0ur1NkRsWnUngKDnQ7gZIThtJPQSHEoGhNAApYyHXsLo7Wpe2LGzP2DuF0kbJp3ube8nz5aDZvXxR/368/bCcXUQfSDFsZDlSFY4qgUrboOS/XVtddY1197um7+FWEz38OOmV90wHDo2o6LtU0ZitKPqXaVjIZWxIkzULl5ti6B7xvqC8qnKbQFywN6ikbclTKSb3PqxUOGYTTALTEjasageYW1m+CA77zuVDfjXfVdKYQK4DyGwLCehGWyDf2Ru+SZBKltzPEKfkT6dw9iy62467IPUratD8AX3+6nmO9PvtPeQlrAqHpjMkkj1Y1QRDEZDA5OcuA1wrqURb2/D2V1nfApkVIDcmsE1zMWbnsy3gQGq3BExDoJa34EBqvCiw+KS9MbIX0lBQfrB65pFBKotA5RjKVQ49w5BcYNA2bGBbCYZEhWFiAtipMGAcqFZtn0Xg7sREYCjlcgLYAgp5gc1NoJ0XGG8LSECTAq1lAaMuUMpZaFYFHiz1lGRfoX9muuObnC4bnIce9FVu5dFcIJNblK+tcWQyTKpL1xmS6wwbOkOpBGxtMUwDEpw7Td1hpLwr8RAYWiF1fJwCA2DSEGhNCRiGkCqq1wVmOoHDqY6584PkUdOg6XP60Q+WYwbd0WD6KsNyjklgNGe+StDWGTAPCU6mOWBjI+jBxJ1BbnJSAJ0d2QkM/X7CmBKYbwq8ISNggYWqQOO46Ivu/MydD6RgUP4msOez5APG0+iq6+pVhpMngeVlhhMngJUVGxwlgnc3JIJCicAcPSpw6RKwsCCwtAQc7wAiFZ07BxmCR4A0HFQQLLvT7c53A6P/k0mkRErDyX48BPFOTASjLy1BKocSjY0ouQHZef1fIvb4Jfdl1Z3n77PcEaENjJKjMqeEU64vFy+qyzqMIBcXBXDBrnnnow+O3S82mCAVyVvfHtgGpfCdFwTMroAz7WSX44BzSj098OUwIvGp87lOez2HHDAqOCEAOVcOD8o5YxgwJw+Bo2TPGd49iRRjt1v1+wilgrydFh1UFGB3D6LwLVWYuL2bvjBVCaO2MNe5U/KMCMWv+f8PCtlGNVZ7neEAAAAASUVORK5CYII='
                    },
                    toBeEntry: {
                        name: '待录入',
                        path: '/commonAsset2/com.evisible.entity.base.common.entity.AssetEntity',
                        icon: 'data:image/png;base64,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'
                    },
                    submitted: {
                        name: '已提交',
                        path: '/commonAsset/com.evisible.entity.base.common.entity.AssetEntity',
                        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAABoCAYAAAAZ6WWcAAAS/klEQVR4Xu2de4wkx13Hv9Xz3J3dmd29G+/j7nx3xr6IO4jJHyGAgs4CCUziIISIIhGEIC9IEPwZiYBxTlYgCCSkIEIgCIQJIBSTmDjy4w+QrUQkKBAIZo9g+3x3vrudW8/ePmZ3dudZhX7Vj+np6e6q7pnpXe9eSae93amu6vp9+vurX1f19I9hhEUIwUbY3Ju+KcaYGNUgYhv2LpR4COLCiwxKC9ClS5HbjTfsA3rUY48plRQVmLZBQwF5wZxf1m73gJp6uNO6fKEfVAg4XWBKgwYCcsNxg7lcZcBD5kAvusb78oqyr+Gss09Hn1vqQXnRPocXgPPl3t/d4AKgqYCFGk8JyQZkw1m0YFQ2eu2et07+9s7hBLUwZQK57LpQFmfNv1UIoguaDSwGrEDj+UKyVeQAusBAcGwwcwTjfmB9m+G0deIb9cMJyCvg2YIJ5zqAuWkBvAqsWxAJHEE7v2xBtVyjD7AgZfkaUQmJFLR4zgREcNbnTTAEpdZgWARQm+m1XW8cbliFfM/NFTcFKgCKeQGCJ8GtCglNAntZSLcYoi4/WAMGDIT0GIAvLjNctlTUvGFIQEULTmGGodDNYvGeRwD2CAzjbQAWIMR0YrMHs4YjlEHX6E+JsW0AtwH+n+iIr2L1ja+inmqhvikktFpBSGC5U9xR13svCFwCoKEsNShydzak8gWGF5cNqaKrUwZKDQYCRIr5/sWfRjr9OATuU1vBNuR+CS2B/hleQ6fzKF6qfAWkOAK2lRc4u8Olui5e4KguCwTA8qqqz1IDanJD2pg1zLmoaqBYZuhuGaiXyM2lUD5xCQb7DQjsl+XV18Z+1GAQ4OIzqN56DBV0UdgSSJU4alUBlLl0hbMbXAdWMCh34GArCQVDurpu3gDfMjAxzbB0/HEJyV2CXJAXo8pDOfUDXJr9ubedg9Y/wVpZexR72wJGiSPV4NIVos4dZfnMWW5VOabwVRNFdzQnYdnoKcmCJHIG7p9/D1LpJ0anJF2XpFsvqox029WtZ/VPyup2fhGvrj4N1uQ9WJaycIHLiJBgeeYrG5Y/KFKThGRFdxQ4dKYMR0kEKZXP4b65bwI4G9UcR7T+Vby2/kPoNpp9sNI73AwwXNGgC1YfqD41uV0ezUsEiQKHpS0DPG+AIIldA2fP/gwyqb/sN7rClzkXYlQf6EEbt524x3mvrLjttPkHcPXqU2CT3ITV4FgpcRlgECyarwJcoLTYAKg+l1cwgDsGkDcwlzVQ30xBZA08cPJzYOznhlPHwOQS0Jxuvahno9uubj1F/0I8iVdu/ipYi6Mw08V6iwMNDhzjcr4KcIGkqmBQtprcLm/PSKGYMcAbBk6f+QbkMgTQi/Ui3seohBUUQwba7YD3z/Aqrl37YRh5jlqbY4J3nfnKdoG2qjzurx+Ue25C2QBFebaa8khJl0dqQtrAAwuvAZiK5PqiXvBOfd2oXxVGxj2BkfW/g1dW7wM6XKqKXGAD3X5VVbmzcmHBGlSUA8qK9E4XDKx1UzIUd6tJpA2cPrEafdgRo6XoHah8jxOGjbxprQYFcH1lHqzDB1R1PNXFdX/3J0H5zk9ut1dDqm9uIjVlOgz3Lq0O3N6Om4Nqqngz9E+g2mnhqMqeq4roIsz9DUZ8LxhywbWZM7B+LYVy3sA2ub2Mgcx2CqSmTJdh8eTt4Iso6E5U67LzqRS1vaj1VecVtb2Q+pWbC2inhFRVe7oL1uaYRhfVBsfcmS5yTTNUx0PcfU/VU5TX7dH8tHjHwCZLyZA8i5QMIiSoPMPCrAuU6lL3eBynuvUfZyXBNpjn70HhsfP3N1H/lY0FtBsmKAoqWujKUH1GdFEJjv6CQbnnp6xhKqqBlHR7BOve47SYf7dEtcDra4ummtICeYLU5mhZ0V/YPOW4PltRtK5XXTZQtwKJ+loKpZyBPZaS0Z5oGsjkGE65QY0r2gqygiquj2q9qPWH6P/GnUW0mwIsx+U8NSG62GpyFI53QaAKdY6ytbLuWlIaVJQN6iZScskox1POTe5U2gBvGmgRqGNqRQVN7uOe9D0eNPGgJ6x/ApVtChg5jh0rTKeAoml05WLtSXSjg/JGfG5QJ+fUoKJeqEeh/s11f1C0SkGRnzaosNDcDerE7CAo3R1W3XoDN7wKF6vbrm69cfR/ayMcVECIPuj6gkBNZw1wl+vzA3UUFDHsGN2gjA7HtmvdL+ReKj6opZm7ri8OtJXNnqJGD0qkML3Xr6ilUg+UKuhT7tR6bhADtxG8s7T1O9XP5IHvexdw+u3ARAnYrgJXvgZ8918A8P4bOe/DL7YrhNVxnP7DoLnHPwBqgqPAzJX04RXlA2rRBSrOlTXKYwjST3wcmD012Or1bwFf+zxt5oyyx/htVbY8iho3qIXiwXF9P/jzwFt+LNh4X/88cPXf4ht3lEferu0HKNUNUdQbKc2loL6lIwa87zNAdjLYnCvLwD//ketz1XnZVVXbGzHGnzio+emKcyO5X16F7EiA3vfH4dd8bRV46hOj1IXZVtS1WjpmdTthRc1PVQbcvvfEg1ZadC9U1YVNFwgFAu//HJDKBIOoXgGe/VRvmhpl/+5edcb/xk7CoO4pVIIvKZUlAqI35fObAa7x4keBM28PBvXtJ4GXnvH5PI6rDSOjurIAJA6qTKACShyXoBPeBrnY6TLwyCeBnM88tf468MzvAp1mfNcXdTxh9av1hBVVnhw+6lPNxbkp4B3vB068FUhn+w0tOLB2DfjGXwNbK8DMSeBHfgm4x3zeBpwD1/8d+OYTQHMHWPhes63ivPtpHLMufX7lX4Fv/yMguvGB6hxZ3U0Y1PEJl+vznqEqutDcJnjoY8DZd4QPf2cN+KffAVq7Zr3CHDBRNG94CQCVY2eAd30CSOfC2/rWPwD/4+cio062IeNf29sPUNa4VVy85glyDV57/MKfmSsOqnLnOvDCZ4Etn6cD7n0b8KMfBnIFVStA5X+B5z49WE81lUUZ/52kQR3L+7i+qM5cYbsPPKE2rl2Dd4Eb/wXc/j9TXaSsUw8C5e/Rb6P6GvD0J/XrD9TUGP+dRsKK8gOlfWV5J6eAS/aDEUANYV7nUAL1FfoymCJqDfpYZ/zrSYOayw0fTKiM+8G/UdUY7ecOqNE229faejNhRc1mQ0BpuAAdW3zoCzq1RleHQFFgMnQJGf9GK2FQMxmfqM/zmFfgkprmWtuH/3Zok0VqgEA99ejgIUGPswU9jOGt73aV+wMqkhmiVx4HqJv/DfzHk2bY/9Z3959TEKjoZx58xGY7YUWV0hW5zuYuut9GD9qo8w7vI383ShMBN18Cnv9DgHfMdn/5r/pvpAnUl39bv88449/q7AMo/SH51wzcabWqjxLUrWXg+T8AOi2z8Xt/AHj44x5FXQG+7OP6AlefYxggcVDFlM9TSNaJ64SpOmP8lb8frLW7ATzz++bff/zXgdkT6pYq3wWe/TTQttb7Fs6ZKxUZz0rFGwQqgqK8PevEULVuwooqGsHBhD0AFTDVCsX97xyEQHtLb7xi/p2WhE7SOmDI0lC7Adz4DtBtm8cQnJMPDq4d0meNbbOu7uJ/4JOdIRfsNk8Y1DSBilpUq7Ce9o6fGeyAViC2KkDXmmdonpieB7I+S02kIAJLC7hUaM+qtAAYKf8TpxX2zRjD0jaDALZFwqCm2Pi3OcoBX7gnSLSuZ6tEwir3r+fRXERAaRVdQkoDpUXzZ1AhsJsrg5/quDT3UWH1dxIHJV/NNNriFVw55G09trLs4IDOhGDlp82AgZRhb1kYaWCGIIXsAtPxBGrjlo/ri0oqxCw7SFhRBTco1fKy98RV9a3P71EsqNqw7CCB5ozJGXOuoc+okJubWQLSCkgSVAPYIEVFdNFRosJ60qAmRe/hFpuDKniw62luR2FeY+WbgJB6aH7x9m8YZlTo3XQMdH0NYP1WsOvzjlN3HO4Wd1nCiprko3d9XhPNW7u1KgdL8xDNLaQI52IwTCX5BRmhoG6qehvu810jYVATPqC0Xbmma1nQBEWmI1i120BzF6A5iaK7KJBs13dnCFA6499LHFR3/IpaeCD61UvAKAr0Lu/otESKvHNDp2b8OnuphBWV7wyxw6tz6QFYPBffIHGOJFBrr8c50jpGY1yNdMKgcn6gArY54g59KWFQrT1gzUdRGvY3h6gx/mbioNrjd31Lb4mLON5xLVIUva13jKWZSVhR2VYMUKrFPU98TcFE2ErCqO3ZqHvmqGEejvA7OQa0kgaVaQ7uR6kMpxnsOfdDpTIwfUzV6mg+py2XjQqwVxu8Hxu4X/K4ON0zoMPa2YQVRaDGXShyK8yYa3j0f7l/JSxD0k/rn5we7M8sI/b9HlDP3g+jRdtOu7d2OM5xtXMJg0o3eqDi7HSSMZTHac7iynYCLK88bgz9d/L7CGqcV+BhaztxUKm98bu+wwaJxtOdSFhRxm7wNw69D68MbXDLBQ08Y2E1PLAYr+mytM9rhP13J/cBlPZA71Z0LMCTBsXq0V1fxNuoWN+RDbsmDkL/vJCwotjO+L8f5Rg9aOMn7g1p1I2kEfYvphIGBQJ1t0S3QOKgttWr56pHzFUXtvZjW7a5PL7tQPY/nbCihB8o7/Wl2ptXTRrRr9f+Iw5g/6yYMCheo6cgPS+oH9awh/74HRjFB5w3YMq3i430XUibKXjf18drXwdE/9Mnuouu4+Jx4PtnV2AU39kPatzv6+O1P4EQP+vvarwuTTUZqcjpukgvKdUkpeo3YO7TjkY9/TP2JRjFXxsvKMrJ4X5VKa+9B4L/uTxn3anAHqDmY33az4C/WfpnxkdgFJ/2fflv5Pf1ud/SHPbyX76XBW9SLmfXA+Iqi+lewbr1hlWqbj9B9SL0z9g1sNxFGBOtUFDaL//VfZ02pX1o7PwUBP8LCDO9kX7RdWVRJah7Bgn3T6nzWOpDyE89K9M9jPR12qoX1BOoVoehs/tbgPiYron6XGVEvJH6CKuceNDBPov05KeQTQsJaiQvqLeTT6pSPtig0DbQaf0mID46uqSUmkgivxZbs13daqr+SUlgf4p09veADHdAjSTlg5MlVJFEhVI/kKLswncfRpfT9yrPmNviITu4qocjVV8ZdTyiZ070Gi5oBzeJ/mlOShmPw5h8zrERKYpSPQyVRIVak4koNdMSUdoHR1XWqQieRmfvYTDxk+B4EBD0Kq+jclNMb8ii5GffATOeR3riOTDD+rYdvanTcns0Pw2VlsgGRYkodRJ92Xmk3KrSdRlHsZ4NynZ7dvo83URf8jbIjtqipM6TavJR1VGEoBqzn5q8CSlVqfP8QVUZVMko7TxS7S4DvXjyrrL8cREkepVgxs7C5kqbFzsZZZD7s3PDuxNSZvMM21YuKVIXlbuw+mERJCp2SD6d42g1xPDpXd2g3NGfX8LkrJWZrdVlMvEXlbvATFBuQBJUUyBrKapFkd+oEiZT4+6gwi8FOa39ESxSVrNjRYAeYCrffVg/JwVJYFaEl0sLqSQbUtwU5H3zVJ+qqszMIHrDgDvDtZ0v3obVyjOZ+9BRVeHoukGpprrp7qSa0gJZP0glLjOw2fmiKFPo+bKQueI9Wa2pGeeGtS/Nq68LrBoolplMp0cJlG1YuUmGBimrw+AGJuesLoPGq1wPhbDqpCALjhdQPi3Q3BUykzVlCDUsSLWqAMqBOeIlIMYk8L7VtsGcvJYLpIXaF5fNlOTFeg/WxDTDet1Ars3gBiYh5c22j9LtrnR3DVNJ5OZsQM2MwFyBY29b9CAVSHkcF12JJ+k4HzWFg7JVRa9Y/aJ1E1zZYICtrC0D9RLDRJNJdTUIVpsBJZg/6d1CriUm+r14KLTTG0TNMx4CQ4XAYMv8mc8IqaK9nEBhSyBV4rCVtDgrMLvB8d4LApf6IbnVNABqYK7ywrKVNbfDQAFGqcFQmGGoN0xgpLDdlgnJgWVBc8ZUOiS0tvrHQUAcSAAms0IqSALKC9Q3BbbyAmd3ONanhKMkDUh6oLywKGxfXDEDjPV5Jl1hzQWsDGCnacLaazPMzR0SMIphrK8DExasqZxAlV6WbwEq5gVqBYG5VYHcKY7KksD5ZRGkJK+afEH5qsqGRT8pbL9sRYPkCkldBOw0gA0L2iKA2kxv/iPFHeZCQOxS3BTy5UMEZ7YgQF8JJkCkInJ17uiOjnHNSXYTdgDhNlmgAQeiQC8s+t1Wl5y76IR2GHA/sL5tgqNC8I5CIShUJJhpAbwKCYeKBGSpyLSb+XdNSIGKsu3qC8sXGK0NPgTpEqnY4KQCrdZuE8RDWBYsGJddYyMw0g5LAngB8v5IAUjCsEJxPyspjaeEJWEs99oht0jQqFx0dfmyBfGwsTpHMKxCj/rI4oLjBkT/91GRCpL8XNdugcCoAbnh6CpucLodHKZ6tmuzxxQARweQ3YQ2KPuAUGB2JS+4wwRBZywhYBzDh7g5vy4ig4oETGdQR6xO2DwUZorYoPwa1VLbEQITF4qfif4fgvET857lo/QAAAAASUVORK5CYII='
                    },
                    feedBack: {
                        name: '待反馈',
                        path: '/commonAsset/com.evisible.entity.base.common.entity.AssetEntity',
                        icon: 'data:image/png;base64,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'
                    }
                }
            }
        },
        computed: {
            ...mapState(['menuList'])
        },
        components: {
            addProject
        },
        methods: {
            async init(subMenuList) {
                // var vm = this;
                // if(this.currentShow){
                //     var response = await this.$http.post(`${this.$apiUrl.getStatistic}/false`,subMenuList);
                //     if (response.data.status == this.$appConst.status){
                //         var result = response.data.data;
                //         vm.content = result;
                //     }
                //     return;
                // }else{
                //     var response2 = await this.$http.post(`${this.$apiUrl.getStatistic}/true`,subMenuList);
                //     if (response2.data.status == this.$appConst.status){
                //         var result2 = response2.data.data;  
                //         vm.content2 = result2;
                //     }
                // }
            },
            currentClick() {
                this.currentShow = !this.currentShow;
                this.init(JSON.parse(sessionStorage.getItem('subMenuList')));
            },
            selectChange (val) {
                this.quantityLabel = []
                this.quantityData = []
                this.drawLine()
                if (val === 'company') {
                    this.handleSetQuantity(this.statisticData.quantitiesByProject)
                } else if (val === 'city') {
                    this.handleSetQuantity(this.statisticData.quantitiesByProject)
                }
            },
            drawLine () {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('myChart'))

                let _this = this
                let option = {
                    title: {
                        text: '项目总览',
                        textStyle: {
                            color: '#140F26',
                            fontSize: 30,
                            lineHeight: 25,
                            fontFamily: 'Microsoft YaHei'
                        },
                        x: '85px',
                        y: '40px'
                    },
                    grid: {
                        show: false, // ---是否显示直角坐标系网格
                        top: 100, // ---相对位置，top\bottom\left\right
                        containLabel: false, // ---grid 区域是否包含坐标轴的刻度标签
                        left: '74px',
                        right: '0'
                    },
                    dataZoom: [{
                        type: 'inside'
                    }, {
                        type: 'slider'
                    }],
                    tooltip: {
                        show: true,
                        showDelay: 0, // 显示延时，添加显示延时可以避免频繁切换
                        hideDelay: 50, // 隐藏延时
                        transitionDuration: 0, // 动画变换时长
                        backgroundColor: '#fff', // 背景颜色（此时为默认色）
                        borderRadius: 4, // 边框圆角
                        textStyle: {
                            color: '#8E99A1',
                            lineHeight: 20
                        },
                        extraCssText: 'box-shadow: 0px 7px 10px 2px rgba(0,0,0,0.1)',
                        padding: 10, // [5, 10, 15, 20] 内边距
                        position: function (p) {
                            return [p[0] + 0, p[1] - 100]
                        },
                        formatter: function (params, ticket, callback) {
                            return `${_this.selectedVal === 'city' ? '城市' : '公司'}: ${params.name} <br/> 数量: ${params.data}`
                        }
                    },
                    xAxis: {
                        data: this.quantityLabel,
                        splitLine: {
                            show: false,
                            lineStyle: { type: 'dashed', color: '#EAEAEC' }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#EAEAEC',
                                type: 'dashed'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            align: 'center',
                            padding: 30,
                            color: '#999',
                            fontSize: '12',
                            fontWeight: '100',
                            fontFamily: 'Microsoft YaHei'
                        }
                    },
                    yAxis: {
                        axisLine: {
                            lineStyle: {
                                color: '#EAEAEC'
                            }
                        },
                        axisLabel: {
                            align: 'center',
                            margin: 20,
                            color: '#BAC8D0',
                            formatter: '{value}',
                            fontSize: '12',
                            fontFamily: 'Microsoft YaHei'
                        },
                        splitNumber: 5,
                        splitLine: {
                            show: true,
                            lineStyle: { type: 'dashed', color: '#EAEAEC' }
                        }
                    },
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: this.quantityData,
                        fontFamily: 'Microsoft YaHei',
                        barMaxWidth: 60,
                        barWidth: 50,
                        itemStyle: {
                            color: function (params) {
                                var key = params.dataIndex
                                if (key === curInt) {
                                    return '#4B6DF7'
                                } else {
                                    return '#EDF0FE'
                                }
                            }
                        },
                        emphasis: {
                            itemStyle: {
                                color: '#4B6DF7',
                                borderColor: '#4B6DF7',
                                borderType: 'solid'
                            }
                        }
                    }]

                }
                // 绘制图表
                myChart.off('click')
                myChart.on('click', function (params) {
                    curInt = params.dataIndex
                    _this.handleSetAssetData(params)
                    myChart.setOption(option)
                })

                myChart.setOption(option)
            },
            async handleGetStatistic () {
                let url = `${this.$apiUrl.edocU}/statistic/v1.0/quantity`
                let response = await this.$http.get(url)
                if (response.data.status === this.$appConst.status) {
                    this.statisticData = response.data.data
                    this.handleSetQuantity(response.data.data.quantitiesByProject)
                }
            },
            handleSetAssetData (params) {
                let data = {
                    company: params.name || params.projectName,
                    quantity: params.value || params.quantity
                }
                this.selectCompay = data
            },
            handleSetQuantity (arr) {
                if (arr.length) {
                    curInt = 0
                    this.handleSetAssetData(arr[0])
                }
                arr.map(v => {
                    this.quantityData.push(v.quantity)
                    this.quantityLabel.push(v.projectName)
                })
                this.drawLine();
            },
            company() {
                sessionStorage.setItem('isShowNewMenu', JSON.stringify(true));
                this.$router.push("/company")
                this.$router.go(0);
            },
            refresh() {
                sessionStorage.setItem('isShowNewMenu', JSON.stringify(true));
                this.$router.go(0);
            }
        },
        mounted() {
            var vm = this;
            vm.currentShow = true;
            if(sessionStorage.getItem('subMenuList')){
                this.init(JSON.parse(sessionStorage.getItem('subMenuList')));
            }
            this.$bus.$on('getStatic',function(){
                vm.subMenuList = [];
                if(!vm.menuList[2]){return;}
                vm.menuList[2].subs.map(item=>{
                    if(item.index==='/contractQuery'){
                        vm.subMenuList.push('TRADECONTRACT');
                    }
                    if(item.index.indexOf('commonAsset')!=-1){
                        var sub = item.index.split('/')[2];
                        vm.subMenuList.push(sub);
                    }
                });
                sessionStorage.setItem('subMenuList',JSON.stringify(vm.subMenuList));
                vm.init(vm.subMenuList);
            });
            this.drawLine();
            this.handleGetStatistic();
                
        },
    }
</script>
<style lang="scss" scoped>
.workbench {
    width: calc(100vw - 260px);
    height: calc(100vh - 40px);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    /deep/.projectManage {
        /deep/.el-dialog--small {
            width: 662px !important;
            height: 289px;
        }

        /deep/ .el-dialog__body {
            padding: 30px 20px 0px !important;
        }
    }
}

.order-info {
    text-align: left;
    border: 1px solid #eeeeee;

    .order-show {
        font-weight: 600;
        font-size: 18px;
        padding: 20px;
        border-bottom: 1px solid #eeeeee;
    }

    img {
        width: 26px;
        height: 26px;
        vertical-align: middle;
    }
}

.empty {
    width: 308px;
    height: 365px;
    p {
        margin: 41px 0;
        text-align: center;
        color: #999;
    }
}

#myChart {
    background: #fff;
    div {
        width: 100% !important;
    }
}

.workbenchCont {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: auto;
    .contRight {
        display: flex;
        flex-direction: column;
        padding-left: 20px;
        // width: 480px;
        height: 100%;


        .operList {
            margin-bottom: 15px;
            padding-top: 15px;
            width: 47%;
            height: 230px;
            box-shadow: 2px 3px 8px 0px rgba(0,0,0,0.06);
            border-radius: 12px;
            background: #fff;

            .tit {
                font-size: 16px;
                font-weight: 550;
                color: #B8C2D1;
            }

            .num {
                height: 76px;
                line-height: 76px;
                font-size: 44px;
                color: #303A72;
            }

        }
        .project {
            margin-top: 155px;
            margin-right: 0px;
            // padding: 10% 0px 0px;
            // height: 453px;
            flex: 1;
            background: white;
            background-size: 20%;
            box-shadow: 2px 3px 8px 0px rgba(0,0,0,0.06);
            border-radius: 12px;
            box-sizing: border-box;
            position: relative;
            >div{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                background: white;
                height: 300px;
                border-radius: 12px;
            }
            img {
                display: inline-block;
                margin-bottom: 37px;
            }

            .newBtn {
                margin-left: 26px;
                color: #FDB636;
                background-color: #fff;
                border-color: #FDB636;
            }

            p {
                margin-bottom: 20px;
            }
        }
        operList:nth-child(even) {
            margin-right: 10px;
        }
        .operList:nth-child(odd) {
            float: right;
        }
    }
    .contLeft {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 529px;
        // background: #fff;
        // box-shadow: 2px 3px 8px 0px rgba(0,0,0,0.06);
        .circle {
            position: absolute;
            left: 44px;
            top: 45px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(317deg,rgba(232,63,148,1) 0%,rgba(245,78,94,1) 100%);
            z-index: 5;
        }
        .selectDate {
            position: absolute;
            right: 20px;
            top: 27px;
            width: 235px;
            height: 44px;
            box-shadow: 2px 3px 8px 0px rgba(0,0,0,0.06);
            border-radius: 22px;
            z-index: 10;
            // color: #364076;

            /deep/.el-input__inner {
                height: 44px;
                line-height: 44px;
                border: 0;
                background: transparent;
                color: #364076;
            }
        }

        /deep/.el-table th.is-leaf {
            border-top: 1px solid #EFEFF1 !important;
            border-bottom: 1px solid #EFEFF1 !important;
        }

        .tableWrap {
            min-height: 300px;
            flex: 1;
            margin-bottom: 14px;
            background: #fff;
            box-shadow: 2px 3px 8px 0px rgba(0,0,0,0.06);
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
            overflow: auto;

            /deep/ .el-table{
                font-size: 12px;
                .el-table__empty-block{
                    margin-top: 0!important;
                }
                tr td:first-child, tr th:first-child {
                    padding-left: 17px!important;
                }
            }
            /deep/.paginationWrap {
                position: unset !important;
                margin: 10px 0 0 0;
                .el-pagination{
                    padding-right: 15px;
                }
            }
        }
    }
}

.type-select{
    position: absolute;
    z-index: 100;
    left: 80px;
    top: 35px;
    width: 150px;
    /deep/.el-input__inner{
        font-size: 23px;
        font-weight: 600;
    }
}
.total-amount{
    color: #666666;
    position: absolute;
    right: 25px;
    top: 40px;
    z-index: 100;
    font-size: 15px;
}
</style>
