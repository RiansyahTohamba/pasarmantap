      $(document).ajaxStart(function () {
        $("#loading").css("display", "block");
        $("#ongkosKirim").css("display", "none");
      });

      $.ajax({
        type: 'GET',
        url: '<?php echo base_url("ongkir")?>/'+ $('#tipepengiriman option:selected').val() + '/'+<?php echo $totalBerat ?> + '/'+ $('#kabupaten option:selected').val(),
        success: function (result) {
          //ada 2 kondisi gagal; daerah tidak terjangkau JNE atau klien tidak terhubung internet
          //setelah berubah kabupatennya
          $("#loading").css("display", "none");
          $("#ongkosKirim").css("display", "block");
          $('#ongkosKirim').empty();
          $('#totalPembelian').empty();
          $('#nilaiTotalPembelian').empty();
          if(result == '403'){
            $('#ongkosKirim').append('<b style="color: red">pilih kabupaten terlebih dahulu</b>');
            alert('ongkos kirim tidak bisa dihitung, pilih kabupaten terlebih dahulu');
            $('#tipepengiriman').prop('disabled', 'disabled');
            $('#btnCukupBelanja').prop('disabled', 'disabled');
          }else if(result == '405'){
            $('#ongkosKirim').append('<b style="color: red">daerah tidak terjangkau JNE</b>');
            alert('ongkos kirim tidak bisa dihitung, daerah tidak terjangkau JNE');
            $('#tipepengiriman').prop('disabled', 'disabled');
            $('#btnCukupBelanja').prop('disabled', 'disabled');
          }else if(result == '404') {
            $('#ongkosKirim').append('<b style="color: red">butuh koneksi internet</b>');
            alert('ongkos kirim tidak bisa dihitung, pastikan anda terkoneksi internet');
            $('#tipepengiriman').prop('disabled', 'disabled');
            $('#btnCukupBelanja').prop('disabled', 'disabled');
            
            // $('#tipepengiriman').prop('disabled', false);
            // var totalPembelian = parseInt(result) + parseInt(<?php echo $this->cart->total() ?>);
            // $('#totalPembelian').append( numberFormat(''+totalPembelian,'.') );
            // $('#nilaiTotalPembelian').val(totalPembelian);
            // $('#ongkosKirim').append( numberFormat(''+result,'.') );
            // $('#nilaiOngkosKirim').val(parseInt(result));
          }else {
            var totalPembelian = parseInt(result) + parseInt(<?php echo $this->cart->total() ?>);
            $('#totalPembelian').append( numberFormat(''+totalPembelian,'.') );
            $('#nilaiTotalPembelian').val(totalPembelian);
            $('#ongkosKirim').append( 'Rp '+numberFormat(''+result,'.') );
            $('#nilaiOngkosKirim').val(parseInt(result));
            $('#tipepengiriman').prop('disabled', false);
            $('#btnCukupBelanja').prop('disabled', false);
            $('#notifBeli').empty();
          }
        }
      })
    });