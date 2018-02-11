angular.module('app')
.factory("ticketService", function($http,Notification) {
    var service = {};

    service.getStatuses = function(cb){
        $http.get('/api/admin/companyTicket/statuses')
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getTicket = function(ticket_id,which,cb){
        $http.get('/api/admin/'+which+'Ticket/get/'+ticket_id)
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getCompanyNewTicketsCount = function(cb){
        $http.get('/api/companyInt/ticket/newTicketsCnt')
        .success(function(data){
            cb(data.count);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getTicketWithoutTicketId = function(id,admin_id,which,cb){
        $http.get('/api/admin/'+which+'Ticket/withoutTicketId/'+id+'/'+admin_id)
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getCompanyTickets = function(data,cb){
        $http.get('/api/companyInt/ticket')
        .success(function(data){
            cb(data.data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.update = function(ticket,which){
        $http.put('/api/admin/'+which+'Ticket/'+ticket._id,{data:ticket})
        .success(function(data){
            Notification.success('Изменения успешно сохранены');
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.createMessage = function(ticket_id,comment,which){
        $http.post('/api/admin/'+which+'Ticket/'+ticket_id+'/newComment',comment)
        .success(function(data){
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.create = function(ticket,creator,cb){
        $http.get('jsons/newTicket.json')
        .success(function(newTicket){
            cb(newTicket);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.close = function(ticket_id){
        $http.post('/api/ticket/close/'+ticket_id)
        .success(function(data){
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getNotifications = function(data,cb) {
        $http.post('/api/admin/user/bulkTicket',data)
        .success(function(data){
            console.log('bulkTicket',data);
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }


    return service;
})    
