function deleteStadium(id){
  $.ajax({
    url:'/stadiums/' + id,
    type: 'DELETE',
    success: (result) => {
      window.locaton.reload(true);
    }
  })
};