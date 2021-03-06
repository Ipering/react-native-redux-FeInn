
import React , { Component } from 'react';
import {
  Navigator ,
  View ,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import LightBox from 'react-native-lightbox'
import Carousel from 'react-native-looped-carousel'

class Article extends Component {
  constructor (props){
    super(props);
    this._onScroll = this._onScroll.bind(this);
  }

  componentWillMount(){
    const { actions , Acticle } = this.props;
    actions.getPhoto({
      page : Acticle.page,
      limit: Acticle.limit
    })
  }

  _onScroll(e) {
    const { actions , Acticle } = this.props;

    console.log(22222,this)
    let scrollH = e.nativeEvent.contentSize.height; //scrollview的高度
    let y = e.nativeEvent.contentOffset.y;//当前滑动显示的y轴坐标
    let height = e.nativeEvent.layoutMeasurement.height ;//显示部分高度
    if (scrollH - y < height) {//处理加载更多
      // this._loadmore();

      actions.getPhoto({
        page : Acticle.page + 1,
        limit: Acticle.limit
      })
    }
  }

  render (){
    console.log(this)
    const { Acticle } = this.props;
    return (
      <View style={[styles.container]}>
      {
        Acticle && Acticle.photos && Acticle.photos.length !=0 ?
        <ScrollView style={{flex:1}}
          onScroll={this._onScroll}
        >

          <View style={styles.imgsWrap}>
            <View style={styles.imgs}>
              {this._renderImg(Acticle.photos.slice(0,Acticle.photos.length/2))}
            </View>
            <View style={styles.imgs}>
              {this._renderImg(Acticle.photos.slice(Acticle.photos.length/2,Acticle.photos.length))}
            </View>
          </View>
        </ScrollView> :
        <View style={{flexDirection:'row',paddingTop:30,alignItems : 'center',justifyContent : 'center'}}>
          <Text style={{fontSize:20}}>说好的妹子呢</Text>
        </View>
      }
      </View>
    )
  }

  _lightImg(item){
    // console.log(item)
    const { Acticle } = this.props;
    const imgs = [];
    const urlArr = [];
    Acticle && Acticle.photos.length && Acticle.photos.map( (v,k) =>{
        urlArr.push(v.url);
        imgs.push(
          <View style={{flex: 1}} key={k}>
            <Image
              style={{flex: 1}}
              resizeMode="contain"
              source={{ uri: v.url }}
            />
          </View>
        )
    })
    imgs.unshift(
      <View style={{flex: 1}} key='212'>
        <Image
          style={{flex: 1}}
          resizeMode="contain"
          source={{ uri: item.url }}
        />
      </View>
    )
    let inx = urlArr.findIndex( (v,k,arr) => {
      return v == item.url;
    })
    imgs.splice(inx,1);
    return (
      <Carousel
        style={{ width: width, height: height }}
        autoplay={false}
      >
        {imgs}
      </Carousel>
    );
  }


  _renderImg(imgs){
    return (
      imgs.map( (v,k) =>{
        return (
          <TouchableOpacity
            key={'photo-' + k}
          >
            <LightBox
              renderContent={()=>this._lightImg(v)}
            >
              <Image
                style={{width:width/2,height:parseInt(Math.random() * (width/4) + (width/2))}}
                source={{uri : v.url}}
              />
            </LightBox>
          </TouchableOpacity>
        )
      })
    )
  }
}
const { width , height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container : {
    flex : 1,
    // alignItems : 'center',
    // justifyContent : 'center',
    // backgroundColor : 'blue'
  },
  imgsWrap : {
    flex :1,
    flexDirection : "row"
  },
  imgs : {
    flex : 1
  },
})

export const LayoutComponent = Article;
export function mapStateToProps(state){
  return {
    Acticle : state.Acticle,
  }
}
