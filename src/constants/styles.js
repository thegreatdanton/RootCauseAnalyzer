import { StyleSheet } from 'react-native';

const customStyles = StyleSheet.create({
  option: {
    borderWidth: 1,
    borderColor: '#202020',
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 5,
  },
  optionContent: {
    marginHorizontal: 5,
    color: '#808080',
    fontFamily: 'SFUIText-Regular',
  },
  optionsContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  categoryContainer: {
    borderWidth: 2,
    borderColor: 'cyan',
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  pickerContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  eventDescription: {
    borderRadius: 10,
    backgroundColor: '#202020',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    marginHorizontal: 10,
    // position: 'absolute',
  },
  searchInputContainer: {
    borderRadius: 10,
  },
  searchInputStyle: {
    color: '#fff',
    fontFamily: 'OpenSans-Regular',
  },
  countContainer: {
    backgroundColor: '#202020',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    height: 30,
    width: 40,
    flex: 1,
  },
  countText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'OpenSans-Regular',
    flex: 1,
  },
  subMenu: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 10,
    marginRight: 10,
    flex: 0.5,
  },
});

export default customStyles;
