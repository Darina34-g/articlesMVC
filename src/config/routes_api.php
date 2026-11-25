<?php

return [
    '~^articles$~' => [\src\controllers\api\ArticlesApiController::class,'GET' => 'all', 'POST' => 'add'],    
    '~^articles/(\d+)$~' => [\src\controllers\api\ArticlesApiController::class,'GET' => 'view', 'DELETE' => 'delete'],    

];