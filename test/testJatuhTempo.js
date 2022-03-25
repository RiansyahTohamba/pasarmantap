/**
 * Created by riansyah on 4/21/2016.
 */
var models = require('../models');
var async = require('async');
var moment = require('moment');

verifikasiPembayaran()
function verifikasiPembayaran(){
    var moment = require("moment");
    var now = moment();
    models.Invoice.findAll({
      where : {
                jatuh_tempo :moment(now).format('YYYY-MM-DD'), 
              }
    }).then(function(invoice) {
        if(invoice.length > 0){
           for(var counterInvoice =0 ; counterInvoice < invoice.length ;counterInvoice++) {        
                if(invoice[counterInvoice].status_tampil == 3|| invoice[counterInvoice].status_tampil == 4){
                    models.Invoice.update({
                        status_tampil : '8'
                    },{
                        where: { id : invoice[counterInvoice].id }
                    });
                    models.Invoice_Status.create({
                        invoiceId : invoice[counterInvoice].id,
                        statusId : '8',
                        waktu : moment(now).format('YYYY-MM-DD HH:mm')
                    });
                }else if(invoice[counterInvoice].status_tampil == 0){
                    models.Invoice.update({
                        status_tampil : '10'
                    },{
                        where: { id : invoice[counterInvoice].id }
                    }).then(function(invoice) {
                        models.Invoice_Status.create({
                            invoiceId : invoice.id,
                            statusId : '10',
                            waktu : moment(now).format('YYYY-MM-DD HH:mm')
                        });
                    });
                }
           }
        }
    });
}
