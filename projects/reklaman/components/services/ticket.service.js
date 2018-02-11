angular.module('app')
.factory("ticketService", function($http) {
    var service = {};

        // FROM AND LIMIT CAN BE NULL. THAT MEANS GET ALL DATA (FROM BEGIN TO END) 

    
    service.getStatuses = function(cb){
        //method - (get)
        //api - /api/ticket/status
        $http.get('jsons/ticket_statuses.json')
            .success(function(data){
                cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getTicket = function(admin_id,user_id,cb){
        //method - (get)
        //api - /api/ticket/:admin_id/:user_id
        $http.get('jsons/ticket.json')
            .success(function(data){
                cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getTicketById = function(id,company_id,cb){
        //method - (get)
        //api - /api/ticket/:id/:company_id
        $http.get('jsons/ticketById.json')
            .success(function(data){
                console.log(data);
                cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getCompanyTickets = function(data,cb){
        //method - (get)
        //api - /api/ticket/
        //data - {id:user_id,search:search}
        $http.get('jsons/company_tickets.json')
            .success(function(data){
                cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }
        
    service.update = function(ticket){
        //method - (put)
        //api - /api/ticket/
        //data - {ticket:ticket}
        $http.put('/api/ticket/',{ticket:ticket})
            .success(function(data){
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.createMessage = function(ticket_id,message){
        //method - (post)
        //api - /api/ticket/message
        //data - {ticket_id:ticket_id,message:{from:obj,to:id,message:string}}
        $http.post('/api/ticket/message',{ticket_id:ticket_id,message:message})
            .success(function(data){
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.create = function(ticket,creator,cb){
        //method - (post)
        //api - /api/ticket
        //data - {ticket:{subject:string,text:string},creator:id}
        //response - new ticket
        $http.get('jsons/newTicket.json')
            .success(function(newTicket){
                    cb(newTicket);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.close = function(ticket_id){
    	//method - (post)
    	//api - /api/ticket/close/:ticket_id
        //params - ticket id
    	$http.post('/api/ticket/close/'+ticket_id)
			.success(function(data){
				})
			.error(function(err){
				console.log(err);
			})
    }

    service.getNotifications = function(data,cb) {
        //method - (post)
        //api - /api/notifications
        //data - {from:number,limit:number,search:string,which:string}
        //which can be 'company' or 'user'
        $http.get('jsons/mass_notifications_company.json')
            .success(function(data){
                cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }


    return service;
  })    
