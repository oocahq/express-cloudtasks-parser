module.exports.cloudTasksParser = function() { 
    return function(req, res, next) {
        const headers = req.headers
        const queueName = headers['x-cloudtasks-queuename']
        const taskName  = headers['x-cloudtasks-taskname']
        const taskRetryCount = headers['x-cloudtasks-taskretrycount']
        const taskExecutionCount = headers['x-cloudtasks-taskexecutioncount']
        const taskETA = headers['x-cloudtasks-tasketa']
        const taskPreviousResponse = headers['x-cloudtasks-taskpreviousresponse']
        const taskRetryReason = headers['x-cloudtasks-taskretryreason']

        if(!queueName) {
            return next()
        }

        req.task = {
            queue: queueName,
            name: taskName,
            retryCount: taskRetryCount,
            executionCount: taskExecutionCount,
            eta: taskETA,
            previousResponse: taskPreviousResponse,
            retryReason: taskRetryReason,
        }

        req.task.rawBody = '';
        req.setEncoding('utf8');

        req.on('data', function(chunk) { 
            req.task.rawBody += chunk;
        });

        req.on('end', function() {
            try {
                req.task.body = JSON.parse(req.task.rawBody)    
            } catch(e) {
                req.task.body = req.task.rawBody
            } finally {
                next()
            }
        });
    }
}